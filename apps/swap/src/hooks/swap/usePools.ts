import { useMemo, useEffect, useState } from "react";
import { Pool, Token, FeeAmount } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { getSwapPoolMetadata, useSwapPools } from "@icpswap/hooks";
import { isNullArgs, nonNullArgs, numberToString } from "@icpswap/utils";
import type { Null, PoolMetadata } from "@icpswap/types";
import { getPool_update_call } from "hooks/swap/v3Calls";
import { NETWORK, network } from "constants/index";
import { useToken, getTokensFromInfos } from "hooks/useCurrency";
import { getTokenInfo } from "hooks/token/calls";
import { TokenInfo, PoolState } from "types/index";

import { getMultiPoolsMetadata } from "./usePoolsMetadata";

const POOL_METADATA_UPDATE_INTERVAL = 60000;

type TypePoolsState = {
  id: string;
  metadata: PoolMetadata | undefined;
  key: string;
  checked: boolean;
};

type TransformedKey = { token0: string; token1: string; fee: FeeAmount };

function transformedKeyToKey(transformedKey: TransformedKey) {
  return `${transformedKey.token0}_${transformedKey.token1}_${transformedKey.fee}`;
}

export type PoolKey = [Token | Null, Token | Null, FeeAmount | undefined];

export function usePools(poolKeys: PoolKey[], withoutVerify = false): [PoolState, Pool | null][] {
  const [pools, setPools] = useState<{ [key: string]: TypePoolsState | null }>({});
  const [loading, setLoading] = useState(false);

  const sortedPoolKeys: PoolKey[] = useMemo(() => {
    return poolKeys.map(([token0, token1, fee]) => {
      if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(fee)) return [token0, token1, fee];

      const __token0 = token0.sortsBefore(token1) ? token0 : token1;
      const __token1 = __token0.equals(token0) ? token1 : token0;

      return [__token0, __token1, fee];
    });
  }, [JSON.stringify(poolKeys)]);

  useEffect(() => {
    async function call() {
      if (sortedPoolKeys && sortedPoolKeys.length > 0) {
        setLoading(true);

        const poolsMetadata = await getMultiPoolsMetadata(sortedPoolKeys);
        const pools: { [id: string]: TypePoolsState } = {};

        sortedPoolKeys.forEach((poolKey, index) => {
          const [token0, token1, fee] = poolKey;

          if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(fee)) return;

          const key = transformedKeyToKey({ token0: token0.address, token1: token1.address, fee });

          const metadataResult = poolsMetadata[index];

          if (isNullArgs(metadataResult)) return;

          pools[key] = {
            id: metadataResult.poolId,
            metadata: metadataResult.metadata,
            key,
            checked: !!withoutVerify,
          };
        });

        setPools(pools);
        setLoading(false);

        // Use update call to verify the pool.
        if (withoutVerify === false) {
          sortedPoolKeys.map(async (poolKey, index) => {
            const [token0, token1, fee] = poolKey;

            if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(fee)) return null;

            const pool = await getPool_update_call(token0.address, token1.address, fee);

            const key = transformedKeyToKey({ token0: token0.address, token1: token1.address, fee });

            if (!pool) {
              setPools((prevState) => ({
                ...prevState,
                [key]: null,
              }));
            } else {
              const metadataResult = poolsMetadata[index];

              if (nonNullArgs(metadataResult)) {
                setPools((prevState) => ({
                  ...prevState,
                  [key]: {
                    key,
                    id: pool.canisterId.toString(),
                    metadata: metadataResult.metadata,
                    checked: true,
                  },
                }));
              }
            }
          });
        }
      }
    }

    call();
  }, [JSON.stringify(sortedPoolKeys), withoutVerify]);

  // Interval update pool's metadata
  useEffect(() => {
    let timer: number | null = null;

    async function call() {
      if (pools) {
        Object.values(pools).forEach(async (poolResult) => {
          if (poolResult) {
            const { id, key, metadata, checked } = poolResult;

            if (!metadata || !pools[key]) return;

            getSwapPoolMetadata(id).then((result) => {
              if (result) {
                if (result.liquidity !== metadata.liquidity || result.sqrtPriceX96 !== metadata.sqrtPriceX96) {
                  setPools((prevState) => ({
                    ...prevState,
                    [key]: {
                      key,
                      id,
                      metadata: result,
                      checked,
                    },
                  }));
                }
              }
            });
          }
        });
      }
    }

    timer = setInterval(() => call(), POOL_METADATA_UPDATE_INTERVAL);

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [JSON.stringify(pools)]);

  return useMemo(() => {
    return sortedPoolKeys.map((poolKey, index) => {
      const [token0, token1, fee] = poolKey;

      if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(fee)) return [PoolState.INVALID, null];

      if (loading) return [PoolState.LOADING, null];

      const key = transformedKeyToKey({ token0: token0.address, token1: token1.address, fee });

      const result: TypePoolsState | null | undefined = pools[key];

      if (!result) return [PoolState.NOT_EXISTS, null];

      const { metadata, id, checked } = result;

      if (
        isNullArgs(metadata) ||
        isNullArgs(metadata.token0) ||
        isNullArgs(metadata.token1) ||
        isNullArgs(metadata.fee) ||
        isNullArgs(id)
      )
        return [PoolState.NOT_EXISTS, null];

      try {
        const { fee, sqrtPriceX96, liquidity, tick } = metadata;

        const [token0, token1] = poolKeys[index];

        if (isNullArgs(token0) || isNullArgs(token1)) return [PoolState.NOT_EXISTS, null];

        // Renew token standard from the pool metadata
        const __token0 = new Token({
          address: token0.address,
          decimals: token0.decimals,
          symbol: token0.symbol,
          name: token0.name,
          standard: token0.address === metadata.token0.address ? metadata.token0.standard : metadata.token1.standard,
          logo: token0.logo,
          transFee: token0.transFee,
        });

        const __token1 = new Token({
          address: token1.address,
          decimals: token1.decimals,
          symbol: token1.symbol,
          name: token1.name,
          standard: token1.address === metadata.token1.address ? metadata.token1.standard : metadata.token0.standard,
          logo: token1.logo,
          transFee: token1.transFee,
        });

        return [
          checked ? PoolState.EXISTS : PoolState.NOT_CHECK,
          new Pool(
            id,
            __token0,
            __token1,
            Number(fee),
            numberToString(sqrtPriceX96),
            numberToString(liquidity),
            Number(tick),
          ),
        ];
      } catch (error) {
        console.error("Error when constructing the pool", error);
        return [PoolState.NOT_EXISTS, null];
      }
    });
  }, [JSON.stringify(pools), loading, , JSON.stringify(sortedPoolKeys)]);
}

export function usePool(
  currencyA: Token | Null,
  currencyB: Token | Null,
  feeAmount: FeeAmount | undefined,
  withoutVerify = false,
) {
  const poolKeys: [Token | Null, Token | Null, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount],
  );

  return usePools(poolKeys, withoutVerify)[0];
}

export function useTokenSwapPools(tokens: string[] | undefined) {
  const { result: allPools } = useSwapPools();

  return useMemo(() => {
    if (!tokens || !allPools) return undefined;

    return tokens.map((token) => {
      return allPools.filter((pool) => {
        return pool.token1.address === token || pool.token0.address === token;
      });
    });
  }, [allPools, tokens]);
}

export function useTokenHasPairWithBaseToken(token: string | undefined) {
  const tokenPools = useTokenSwapPools(token ? [token] : undefined);

  return useMemo(() => {
    if (!tokenPools || !tokenPools[0] || !token) return undefined;

    return !!tokenPools[0].find((pool) => pool.token0.address === ICP.address || pool.token1.address === ICP.address);
  }, [tokenPools]);
}

export function useTokensHasPairWithBaseToken(tokens: string[] | undefined) {
  const tokenPools = useTokenSwapPools(tokens);

  return useMemo(() => {
    if (!tokenPools || !tokenPools[0] || !tokens) return undefined;

    if (network === NETWORK.LOCAL) return true;

    if (tokens.find((token) => token === ICP.address)) return true;

    return tokens.reduce((prev, curr, index) => {
      const hasPairWithBaseToken = !!tokenPools[index].find(
        (pool) => pool.token0.address === ICP.address || pool.token1.address === ICP.address,
      );

      return prev || hasPairWithBaseToken;
    }, false);
  }, [tokenPools]);
}

export function usePoolByPoolId(canisterId: string | Null): [PoolState, Pool | null] {
  const [pool, setPool] = useState<PoolMetadata | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const call = async () => {
      if (canisterId) {
        setLoading(true);
        const poolInfo = await getSwapPoolMetadata(canisterId);
        setPool(poolInfo);
        setLoading(false);
      }
    };

    call();
  }, [canisterId]);

  const [, token0] = useToken(pool?.token0.address);
  const [, token1] = useToken(pool?.token1.address);

  return useMemo(() => {
    if (loading) return [PoolState.LOADING, null];
    if (!pool || !pool?.token0 || !pool?.token1 || !pool?.fee || !token0 || !token1 || !canisterId)
      return [PoolState.NOT_EXISTS, null];

    const { fee, sqrtPriceX96, liquidity, tick } = pool;

    try {
      return [
        PoolState.EXISTS,
        new Pool(
          canisterId,
          token0.wrapped,
          token1.wrapped,
          Number(fee),
          numberToString(sqrtPriceX96),
          numberToString(liquidity),
          Number(tick),
        ),
      ];
    } catch (error) {
      console.error("Error when constructing the pool", error);
      return [PoolState.NOT_EXISTS, null];
    }
  }, [pool, loading, token0, token1, canisterId]);
}

export function usePoolsByIds(canisterIds: string[] | undefined): {
  Pools: [PoolState, Pool | null][];
  tokens: { [key: string]: Token };
} {
  const [pools, setPools] = useState<(PoolMetadata | undefined)[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const [tokens, setTokens] = useState<{ [key: string]: Token }>({} as { [key: string]: Token });

  useEffect(() => {
    async function call() {
      if (canisterIds) {
        setLoading(true);

        const pools = await Promise.all(
          canisterIds.map(async (canisterId) => {
            return await getSwapPoolMetadata(canisterId);
          }),
        );

        setPools(pools);
        setLoading(false);
      }
    }

    call();
  }, [canisterIds]);

  const tokenIds = useMemo(() => {
    if (pools) {
      const ids = pools.reduce((prev, curr) => {
        return prev.concat(curr ? [curr.token0.address, curr.token1.address] : []);
      }, [] as string[]);

      return [...new Set(ids)];
    }

    return undefined;
  }, [pools]);

  useEffect(() => {
    async function call() {
      if (tokenIds) {
        const tokenInfos = await Promise.all(tokenIds.map(async (id) => await getTokenInfo(id)));
        const tokens = getTokensFromInfos(tokenInfos.filter((info) => !!info) as TokenInfo[]);

        const _tokens: { [key: string]: Token } = {};

        tokens?.forEach((token) => {
          if (token) {
            _tokens[token.address] = token;
          }
        });

        setTokens(_tokens);
      }
    }

    call();
  }, [tokenIds]);

  return useMemo(() => {
    if (loading) return { Pools: [] as [PoolState, null][], tokens: {} };

    if (!pools || Object.keys(tokens).length === 0) return { Pools: [] as [PoolState, null][], tokens: {} };

    const Pools: [PoolState, null | Pool][] = [];

    pools.forEach((pool, index) => {
      if (!pool || !canisterIds) return [PoolState.NOT_EXISTS, null];

      const { fee, sqrtPriceX96, liquidity, tick } = pool;

      const token0 = tokens[pool.token0.address];
      const token1 = tokens[pool.token1.address];

      try {
        Pools.push([
          PoolState.EXISTS,
          new Pool(
            canisterIds[index],
            token0.wrapped,
            token1.wrapped,
            Number(fee),
            numberToString(sqrtPriceX96),
            numberToString(liquidity),
            Number(tick),
          ),
        ]);
      } catch (error) {
        console.error("Error when constructing the pool", error);

        Pools.push([PoolState.NOT_EXISTS, null]);
      }
    });

    return { Pools, tokens };
  }, [pools, loading, tokens, canisterIds]);
}

export { PoolState } from "types/swap";
