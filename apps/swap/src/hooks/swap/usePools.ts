import { Pool, Token, FeeAmount } from "@icpswap/swap-sdk";
import { useMemo, useEffect, useState } from "react";
import { getPool, getPool_update_call } from "hooks/swap/v3Calls";
import { getSwapPoolMetadata, useSwapPoolMetadata, useSwapPools } from "@icpswap/hooks";
import { numberToString } from "@icpswap/utils";
import type { Null, PoolMetadata, TickLiquidityInfo } from "@icpswap/types";
import { NETWORK, network } from "constants/index";
import { ICP } from "@icpswap/tokens";
import { useToken } from "hooks/useCurrency";

export enum PoolState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
  NOT_CHECK = "NOT_CHECK",
}

type TypePoolsState = {
  id: string;
  metadata: PoolMetadata | undefined;
  ticks: TickLiquidityInfo[];
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

  const transformedPoolKeys = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (!currencyA || !currencyB || !feeAmount) return null;

      const tokenA = currencyA.wrapped;
      const tokenB = currencyB.wrapped;

      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;

      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return { token0: token0.address, token1: token1.address, fee: feeAmount } as TransformedKey;
    });
  }, [poolKeys]);

  useEffect(() => {
    async function call() {
      if (transformedPoolKeys && transformedPoolKeys.length) {
        setLoading(true);

        const result = await Promise.all<TypePoolsState | null>(
          transformedPoolKeys.map(async (element) => {
            if (!element) return null;

            const pool = await getPool(element.token0, element.token1, element.fee);

            if (!pool) return null;

            const poolMetadata = await getSwapPoolMetadata(pool.canisterId.toString());

            return {
              key: transformedKeyToKey(element),
              id: pool.canisterId.toString(),
              metadata: poolMetadata,
              ticks: [],
              checked: !!withoutVerify,
            };
          }),
        );

        const pools: { [id: string]: TypePoolsState } = {};

        result.forEach((ele) => {
          if (ele) {
            pools[ele.key] = ele;
          }
        });

        setPools(pools);
        setLoading(false);

        // Use update call to verify the pool.
        if (withoutVerify === false) {
          transformedPoolKeys.map(async (element) => {
            if (!element) return;

            const pool = await getPool_update_call(element.token0, element.token1, element.fee);

            if (!pool) {
              setPools((prevState) => ({
                ...prevState,
                [transformedKeyToKey(element)]: null,
              }));
            } else {
              const poolMetadata = await getSwapPoolMetadata(pool.canisterId.toString());

              setPools((prevState) => ({
                ...prevState,
                [transformedKeyToKey(element)]: {
                  key: transformedKeyToKey(element),
                  id: pool.canisterId.toString(),
                  metadata: poolMetadata,
                  ticks: [],
                  checked: true,
                },
              }));
            }
          });
        }
      }
    }

    call();
  }, [JSON.stringify(transformedPoolKeys), withoutVerify]);

  return useMemo(() => {
    return transformedPoolKeys.map((transformedKey, index) => {
      if (!transformedKey) return [PoolState.INVALID, null];
      if (loading) return [PoolState.LOADING, null];

      const key = transformedKeyToKey(transformedKey);
      const result: TypePoolsState | null | undefined = pools[key];

      if (!result) return [PoolState.NOT_EXISTS, null];

      const { metadata, id, checked } = result;

      if (!metadata?.token0 || !metadata?.token1 || !metadata?.fee || !id) return [PoolState.NOT_EXISTS, null];

      try {
        const { fee, sqrtPriceX96, liquidity, tick } = metadata;
        const [token0, token1] = poolKeys[index];

        if (!token0 || !token1) return [PoolState.NOT_EXISTS, null];

        // Renew token that standard from the pool metadata
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
  }, [JSON.stringify(pools), loading, poolKeys, JSON.stringify(transformedPoolKeys)]);
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

export function usePoolById(poolId: Null | string) {
  const { result: poolMetadata } = useSwapPoolMetadata(poolId);

  const [, token0] = useToken(poolMetadata?.token0.address);
  const [, token1] = useToken(poolMetadata?.token1.address);

  return usePool(token0, token1, poolMetadata?.fee ? Number(poolMetadata?.fee) : undefined);
}
