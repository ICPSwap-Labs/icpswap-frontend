import { Bound } from "@icpswap/constants";
import { type FeeAmount, nearestUsableTick, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import { useMemo } from "react";

export function useTickAtLimit(
  feeAmount: FeeAmount | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
) {
  return useMemo(
    () => ({
      [Bound.LOWER]:
        feeAmount && tickLower
          ? tickLower === nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount])
          : undefined,
      [Bound.UPPER]:
        feeAmount && tickUpper
          ? tickUpper === nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount])
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper],
  );
}
