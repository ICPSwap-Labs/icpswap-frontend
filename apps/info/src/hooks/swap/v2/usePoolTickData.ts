import { tickToPrice, TICK_SPACINGS, FeeAmount, Token, computeSurroundingTicks } from "@icpswap/swap-sdk";
import { numberToString } from "@icpswap/utils";
import { useMemo } from "react";
import { useLiquidityTicks, useSwapPoolIdByKey } from "hooks/swap/v2/calls";
import JSBI from "jsbi";
import BigNumber from "bignumber.js";
import { PoolState, usePool } from "./usePools";

const PRICE_FIXED_DIGITS = 8;

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount) =>
  (tickCurrent || tickCurrent === 0) && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount]
    : undefined;

export function useAllTicks(token0: Token | undefined, token1: Token | undefined, feeAmount: FeeAmount | undefined) {
  const poolKey = useMemo(() => {
    if (!token0 || !token1 || !feeAmount) return undefined;
    return `${token0.address}_${token1.address}_${feeAmount}`;
  }, [token0, token1, feeAmount]);

  const { result: poolCanisterId } = useSwapPoolIdByKey(poolKey);

  return useLiquidityTicks(poolCanisterId);
}

export function usePoolActiveLiquidity(
  currencyA: Token | undefined,
  currencyB: Token | undefined,
  feeAmount: FeeAmount | undefined,
) {
  const isSorted = currencyA && currencyB ? currencyA.wrapped.sortsBefore(currencyB.wrapped) : undefined;
  const token0 = isSorted ? currencyA?.wrapped : currencyB?.wrapped;
  const token1 = isSorted ? currencyB?.wrapped : currencyA?.wrapped;
  const pool = usePool(currencyA, currencyB, feeAmount);

  const tickCurrent = pool[1]?.tickCurrent;

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(
    () => (feeAmount ? getActiveTick(tickCurrent, feeAmount) : undefined),
    [tickCurrent, feeAmount],
  );

  const { loading: isLoading, result: _ticks } = useAllTicks(token0, token1, feeAmount);

  const ticks = useMemo(() => {
    if (!_ticks) return [];

    return _ticks
      .map((item) => {
        const price0 = numberToString(new BigNumber(String(item.price0)).div(String(item.price0Decimal)));
        const price1 = numberToString(new BigNumber(String(item.price1)).div(String(item.price1Decimal)));

        return {
          ...item,
          price0,
          price1,
          tickIdx: Number(item.tickIndex),
          _price0: item.price0,
          _price1: item.price1,
          liquidityNet: numberToString(item.liquidityNet),
        };
      })
      .sort((a, b) => {
        if (a.tickIdx < b.tickIdx) return -1;
        if (a.tickIdx > b.tickIdx) return 1;
        return 0;
      });
  }, [_ticks, isLoading]);

  return useMemo(() => {
    const isUninitialized = pool[0] === PoolState.NOT_EXISTS;

    if (
      !currencyA ||
      !currencyB ||
      !token0 ||
      !token1 ||
      activeTick === undefined ||
      pool[0] !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        isUninitialized,
        activeTick,
        data: undefined,
      };
    }

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1;

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
      liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
      tickIdx: activeTick,
      liquidityNet:
        Number(ticks[pivot].tickIdx) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    };

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true);

    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false);

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);

    return {
      isLoading,
      isUninitialized,
      activeTick,
      data: ticksProcessed,
      isError: _ticks === undefined,
    };
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading]);
}
