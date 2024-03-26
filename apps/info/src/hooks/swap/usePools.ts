import { numberToString } from "@icpswap/utils";
import { Currency, Token, Pool, FeeAmount } from "@icpswap/swap-sdk";
import { useMemo, useEffect, useState } from "react";
import { getSwapPool, getSwapPoolMetadata } from "@icpswap/hooks";
import type { PoolMetadata, TickLiquidityInfo } from "@icpswap/types";
import { useToken, getTokensFromInfo } from "hooks/useToken";
import { getTokenInfo } from "hooks/token/info-calls";
import { TokenInfo } from "types";

export enum PoolState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
}

type TypePoolsState = {
  address: string;
  info: PoolMetadata | undefined;
  ticks: TickLiquidityInfo[];
};

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][],
): [PoolState, Pool | null][] {
  const [pools, setPools] = useState<TypePoolsState[]>([]);
  const [loading, setLoading] = useState(false);

  const transformedPoolKeys: ([Currency, Currency, FeeAmount] | null)[] = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (!currencyA || !currencyB || !feeAmount) return null;

      const tokenA = currencyA?.wrapped;
      const tokenB = currencyB?.wrapped;
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return [token0, token1, feeAmount];
    });
  }, [poolKeys]);

  useEffect(() => {
    if (transformedPoolKeys && transformedPoolKeys.length && !transformedPoolKeys.includes(null)) {
      setLoading(true);

      Promise.all<TypePoolsState>(
        transformedPoolKeys.map(async (ele) => {
          if (!ele) return { address: "", info: undefined, ticks: [] };

          const token0 = ele[0];
          const token1 = ele[1];
          const fee = ele[2];

          const args = {
            token0: { address: token0.wrapped.address, standard: token0.standard },
            token1: { address: token1.wrapped.address, standard: token1.standard },
            fee: BigInt(fee),
            sqrtPriceX96: "0",
          };

          const poolData = await getSwapPool(args);

          let poolInfo: PoolMetadata | undefined;
          const ticks = [] as TickLiquidityInfo[];

          if (poolData) {
            poolInfo = await getSwapPoolMetadata(poolData.canisterId.toString());
            // ticks = (await (await swapPool(poolAddress)).getTickInfos()) as TickLiquidityInfo[];
          }

          return {
            address: poolData?.canisterId.toString() ?? "",
            info: poolInfo,
            ticks,
          };
        }),
      ).then((result) => {
        setPools(result);
        setLoading(false);
      });
    }
  }, [transformedPoolKeys]);

  return useMemo(() => {
    return transformedPoolKeys.map((poolKey, index) => {
      if (!poolKey) return [PoolState.INVALID, null];
      if (loading) return [PoolState.LOADING, null];

      const _pool: TypePoolsState | undefined = pools[index];
      const { info: pool, address: poolAddress } = _pool ?? ({} as TypePoolsState);

      if (!pool || !pool?.token0 || !pool?.token1 || !pool?.fee) return [PoolState.NOT_EXISTS, null];

      try {
        const { fee, sqrtPriceX96, liquidity, tick } = pool;
        const [token0, token1] = poolKey;

        return [
          PoolState.EXISTS,
          new Pool(
            poolAddress,
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
    });
  }, [pools, loading, poolKeys, transformedPoolKeys]);
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
) {
  const poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount],
  );

  return usePools(poolKeys)[0];
}

export function usePoolByPoolId(canisterId: string | undefined): [PoolState, Pool | null] {
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
        const tokens = getTokensFromInfo(tokenInfos.filter((info) => !!info) as TokenInfo[]);

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
