import { tickToPrice, TICK_SPACINGS, Token, FeeAmount, TickMath, computeSurroundingTicks } from "@icpswap/swap-sdk";
import { JSBI } from "utils/index";
import { useMemo } from "react";
import { useSwapAllTicks } from "@icpswap/hooks";
import { usePoolCanisterId } from "hooks/swap/index";
import { isNullArgs, BigNumber } from "@icpswap/utils";

import { PoolState, usePool } from "./usePools";

const PRICE_FIXED_DIGITS = 8;

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount) =>
  (tickCurrent || tickCurrent === 0) && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount]
    : undefined;

type Tick = {
  liquidityGross: bigint;
  liquidityNet: bigint;
  price0: bigint;
  price1: bigint;
  tickIndex: bigint;
  price0Decimal: number;
  price1Decimal: number;
};

export function useAllTicks(token0: Token | undefined, token1: Token | undefined, feeAmount: FeeAmount) {
  const poolId = usePoolCanisterId(token0?.address, token1?.address, feeAmount);

  const { result: allTicks, loading } = useSwapAllTicks(poolId, 5000);

  const ticks = useMemo(() => {
    const ticks: Tick[] = [];

    if (allTicks) {
      for (let i = 0; i < allTicks.length; i++) {
        const tick = allTicks[i];
        const sqrtRatioX = TickMath.getSqrtRatioAtTick(Number(tick.id));

        const tempInfo = {
          liquidityGross: tick.liquidityGross,
          liquidityNet: tick.liquidityNet,
          price0: BigInt(sqrtRatioX.toString()), // Nat.pow(sqrtRatioX, 2) * Nat.pow(10, 100);
          price1: BigInt(JSBI.divide(JSBI.BigInt(1), sqrtRatioX).toString()), // Nat.pow(Nat.pow(10, 100) / sqrtRatioX, 2);
          tickIndex: BigInt(tick.id),
          price0Decimal: 1, // Nat.pow(10, 100);
          price1Decimal: 1, // Nat.pow(Nat.pow(10, 100), 2);
        };

        ticks.push(tempInfo);
      }
    }

    return ticks;
  }, [allTicks]);

  return { loading, result: ticks };
}

export function useLiquidityAllTicks(token0: Token | undefined, token1: Token | undefined, feeAmount: FeeAmount) {
  const poolId = usePoolCanisterId(token0?.address, token1?.address, feeAmount);

  const { result: allTicks, loading } = useSwapAllTicks(poolId, 5000);

  const ticks = useMemo(() => {
    if (allTicks) {
      return allTicks.map((tick) => {
        const sqrtRatioX = TickMath.getSqrtRatioAtTick(Number(tick.id));
        const __price0 = BigInt(sqrtRatioX.toString()); // Nat.pow(sqrtRatioX, 2) * Nat.pow(10, 100);
        const __price1 = BigInt(JSBI.divide(JSBI.BigInt(1), sqrtRatioX).toString()); // Nat.pow(Nat.pow(10, 100) / sqrtRatioX, 2);
        const price0Decimal = 1; // Nat.pow(10, 100);
        const price1Decimal = 1; // Nat.pow(Nat.pow(10, 100), 2);

        const price0 = new BigNumber(__price0.toString()).div(price0Decimal).toString();
        const price1 = new BigNumber(__price1.toString()).div(price1Decimal.toString()).toString();

        return {
          liquidityGross: tick.liquidityGross,
          liquidityNet: tick.liquidityNet.toString(),
          price0,
          price1,
          tickIdx: Number(tick.id),
          price0Decimal,
          price1Decimal,
        };
      });
    }

    return undefined;
  }, [allTicks]);

  return { loading, result: ticks };
}

export function usePoolActiveLiquidity(
  currencyA: Token | undefined,
  currencyB: Token | undefined,
  feeAmount: FeeAmount,
) {
  const isSorted = currencyA && currencyB ? currencyA.wrapped.sortsBefore(currencyB.wrapped) : undefined;
  const token0 = isSorted ? currencyA?.wrapped : currencyB?.wrapped;
  const token1 = isSorted ? currencyB?.wrapped : currencyA?.wrapped;
  const [poolState, pool] = usePool(currencyA, currencyB, feeAmount, true);

  const tickCurrent = pool?.tickCurrent;

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(tickCurrent, feeAmount), [tickCurrent, feeAmount]);

  const { loading: isLoading, result: ticks } = useLiquidityAllTicks(token0, token1, feeAmount);

  const sortedTicks = useMemo(() => {
    if (!ticks) return [];

    return ticks.sort((a, b) => {
      if (a.tickIdx < b.tickIdx) return -1;
      if (a.tickIdx > b.tickIdx) return 1;
      return 0;
    });
  }, [ticks]);

  return useMemo(() => {
    const isUninitialized = poolState === PoolState.NOT_EXISTS;

    if (
      !token0 ||
      !token1 ||
      isNullArgs(activeTick) ||
      poolState !== PoolState.EXISTS ||
      !sortedTicks ||
      sortedTicks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || poolState === PoolState.LOADING,
        isUninitialized,
        activeTick,
        data: undefined,
      };
    }

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = sortedTicks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1;

    if (pivot < 0) {
      // consider setting a local error
      console.error("TickData pivot not found");
      return {
        isLoading,
        isUninitialized,
        activeTick,
        data: undefined,
      };
    }

    const activeTickProcessed = {
      liquidityActive: JSBI.BigInt(pool?.liquidity ?? 0),
      tickIdx: activeTick,
      liquidityNet:
        Number(sortedTicks[pivot].tickIdx) === activeTick
          ? JSBI.BigInt(sortedTicks[pivot].liquidityNet)
          : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    };

    const formatTicks = sortedTicks.map((tick) => ({
      tickIdx: tick.tickIdx,
      liquidityNet: tick.liquidityNet,
      liquidityGross: tick.liquidityGross,
    }));

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, formatTicks, pivot, true);
    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, formatTicks, pivot, false);
    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);

    return {
      isLoading,
      isUninitialized,
      activeTick,
      data: ticksProcessed,
      isError: ticks === undefined,
    };
  }, [currencyA, currencyB, activeTick, pool, sortedTicks, isLoading, poolState, ticks]);
}
