import { Pool, Token, FeeAmount } from "@icpswap/swap-sdk";
import { numberToString } from "@icpswap/utils";
import { useMemo, useEffect, useState } from "react";
import { swapFactory, swapFactoryV1, swapPool } from "actor/swapV2";
import { SwapPoolInfo, TickLiquidityInfo } from "types/swapv2";

export enum PoolState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
}

type TypePoolsState = {
  address: string;
  info: SwapPoolInfo | null;
  ticks: TickLiquidityInfo[];
};

export function usePools(
  poolKeys: [Token | undefined, Token | undefined, FeeAmount | undefined][],
  version?: "v2" | "v1",
): [PoolState, Pool | null][] {
  const [pools, setPools] = useState<TypePoolsState[]>([]);
  const [loading, setLoading] = useState(false);

  const transformedPoolKeys = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (!currencyA || !currencyB || !feeAmount) return null;

      const tokenA = currencyA?.wrapped;
      const tokenB = currencyB?.wrapped;
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return `${token0.address}_${token1.address}_${feeAmount}`;
    });
  }, [poolKeys]);

  useEffect(() => {
    if (transformedPoolKeys && transformedPoolKeys.length && !transformedPoolKeys.includes(null)) {
      setLoading(true);

      Promise.all<TypePoolsState | undefined>(
        transformedPoolKeys.map(async (key) => {
          if (!key) return undefined;

          let poolAddress = "";

          if (version === "v1") {
            poolAddress = (await (await swapFactoryV1()).getPool(key)) as string;
          } else {
            poolAddress = (await (await swapFactory()).getPool(key)) as string;
          }

          let poolInfo: SwapPoolInfo | null = null;
          const ticks: TickLiquidityInfo[] = [];

          if (poolAddress) {
            poolInfo = await (await swapPool(poolAddress)).infoWithNoBalance();
          }

          return {
            address: poolAddress,
            info: poolInfo,
            ticks,
          };
        }),
      ).then((result) => {
        setPools(result.filter((e) => !!e) as TypePoolsState[]);
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
        const { fee, sqrtRatioX96, liquidity, tickCurrent } = pool;
        const [token0, token1] = poolKeys[index];

        if (!token0 || !token1) return [PoolState.NOT_EXISTS, null];

        return [
          PoolState.EXISTS,
          new Pool(
            poolAddress,
            token0.wrapped,
            token1.wrapped,
            Number(fee),
            numberToString(sqrtRatioX96),
            numberToString(liquidity),
            Number(tickCurrent),
          ),
        ];
      } catch (error) {
        console.error("Error when constructing the pool", error);
        return [PoolState.NOT_EXISTS, null];
      }
    });
  }, [pools, loading, poolKeys, transformedPoolKeys]);
}

export function usePool(currencyA: Token | undefined, currencyB: Token | undefined, feeAmount: FeeAmount | undefined) {
  const poolKeys: [Token | undefined, Token | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount],
  );

  return usePools(poolKeys)[0];
}

export function usePoolV1(
  currencyA: Token | undefined,
  currencyB: Token | undefined,
  feeAmount: FeeAmount | undefined,
) {
  const poolKeys: [Token | undefined, Token | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount],
  );

  return usePools(poolKeys, "v1")[0];
}
