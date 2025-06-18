import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { PositionState } from "utils/swap/index";

export function usePositionState(position: Position | undefined) {
  const { pool, tickLower, tickUpper } = position || {};

  return useMemo(() => {
    if (
      isUndefinedOrNull(pool) ||
      isUndefinedOrNull(tickUpper) ||
      isUndefinedOrNull(tickLower) ||
      isUndefinedOrNull(position)
    )
      return undefined;

    const outOfRange =
      pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
        ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
        : false;

    const currentPrice = pool.priceOf(pool.token0).toFixed();
    const token0PriceLower = position.token0PriceLower.toFixed();
    const token0PriceUpper = position.token0PriceUpper.toFixed();

    let state: PositionState = PositionState.InRange;

    if (position.liquidity.toString() === "0") return PositionState.CLOSED;

    if (outOfRange) {
      state = PositionState.OutOfRange;
    } else {
      const __level = BigNumber.minimum(
        new BigNumber(token0PriceLower).minus(currentPrice).dividedBy(currentPrice).absoluteValue(),
        new BigNumber(token0PriceUpper).minus(currentPrice).dividedBy(currentPrice),
      );

      if (__level.multipliedBy(100).isLessThan(10)) {
        state = PositionState.LEVEL1;
      } else if (__level.multipliedBy(100).isLessThan(30)) {
        state = PositionState.LEVEL0;
      }
    }

    return state;
  }, [pool, tickUpper, tickUpper]);
}
