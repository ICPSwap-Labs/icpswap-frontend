import { Pool, Token, FeeAmount } from "@icpswap/swap-sdk";
import { numberToString } from "@icpswap/utils";
import { useMemo, useEffect, useState } from "react";
import { v2SwapPool, v2SwapFactory } from "hooks/v2-actor";
import { SwapPoolInfo, TickLiquidityInfo } from "types/swap-v2";
import { useToken } from "hooks/useToken";

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

      Promise.all<TypePoolsState>(
        transformedPoolKeys.map(async (key) => {
          const poolAddress = (await (await v2SwapFactory()).getPool(key ?? "")) as string;

          let poolInfo: SwapPoolInfo | null = null;
          const ticks = [] as TickLiquidityInfo[];

          if (poolAddress) {
            poolInfo = await (await v2SwapPool(poolAddress)).infoWithNoBalance();
            // ticks = (await (await swapPool(poolAddress)).getTickInfos()) as TickLiquidityInfo[];
          }

          return {
            address: poolAddress,
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
            // _ticks
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

export function usePoolByPoolId(canisterId: string | undefined): [PoolState, Pool | null] {
  const [pool, setPool] = useState<SwapPoolInfo | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const call = async () => {
      if (canisterId) {
        setLoading(true);
        const poolInfo = await (await v2SwapPool(canisterId)).infoWithNoBalance();
        setPool(poolInfo);
        setLoading(false);
      }
    };

    call();
  }, [canisterId]);

  const [, token0] = useToken(pool?.token0);
  const [, token1] = useToken(pool?.token1);

  return useMemo(() => {
    if (loading) return [PoolState.LOADING, null];
    if (!pool || !pool?.token0 || !pool?.token1 || !pool?.fee || !token0 || !token1 || !canisterId)
      return [PoolState.NOT_EXISTS, null];

    const { fee, sqrtRatioX96, liquidity, tickCurrent } = pool;

    try {
      return [
        PoolState.EXISTS,
        new Pool(
          canisterId,
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
  }, [pool, loading, token0, token1, canisterId]);
}
