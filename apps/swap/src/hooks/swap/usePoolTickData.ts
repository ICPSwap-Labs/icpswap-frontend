import { tickToPrice, TICK_SPACINGS, Token, FeeAmount, TickMath } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { JSBI } from "utils/index";
import { useMemo } from "react";
import computeSurroundingTicks from "utils/computeSurroundingTicks";
import { useSwapAllTicks } from "@icpswap/hooks";
import { usePoolCanisterId } from "hooks/swap/index";
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

  const { result: allTicks, loading } = useSwapAllTicks(poolId);

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

export function usePoolActiveLiquidity(
  currencyA: Token | undefined,
  currencyB: Token | undefined,
  feeAmount: FeeAmount,
) {
  const isSorted = currencyA && currencyB ? currencyA.wrapped.sortsBefore(currencyB.wrapped) : undefined;
  const token0 = isSorted ? currencyA?.wrapped : currencyB?.wrapped;
  const token1 = isSorted ? currencyB?.wrapped : currencyA?.wrapped;
  const [poolState, pool] = usePool(currencyA, currencyB, feeAmount);

  const tickCurrent = pool?.tickCurrent;

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(tickCurrent, feeAmount), [tickCurrent, feeAmount]);

  const { loading: isLoading, result: ticks } = useAllTicks(token0, token1, feeAmount);

  const sortedTicks = useMemo(() => {
    if (!ticks) return [];

    return ticks
      .map((item) => {
        const price0 = new BigNumber(String(item.price0))
          .div(String(item.price0Decimal))
          .toFormat({ groupSeparator: "" });
        const price1 = new BigNumber(String(item.price1))
          .div(String(item.price1Decimal))
          .toFormat({ groupSeparator: "" });

        return {
          ...item,
          price0,
          price1,
          tickIdx: Number(item.tickIndex),
          _price0: item.price0,
          _price1: item.price1,
          liquidityNet: item.liquidityNet.toString(),
        };
      })
      .sort((a, b) => {
        if (a.tickIdx < b.tickIdx) return -1;
        if (a.tickIdx > b.tickIdx) return 1;
        return 0;
      });
  }, [ticks, isLoading]);

  return useMemo(() => {
    const isUninitialized = poolState === PoolState.NOT_EXISTS;

    if (
      !currencyA ||
      !currencyB ||
      !token0 ||
      !token1 ||
      activeTick === undefined ||
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
