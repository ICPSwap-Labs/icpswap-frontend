import { type FeeAmount, nearestUsableTick, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import { Bound } from "constants/swap";
import { useMemo } from "react";

export default function useIsTickAtLimit(
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
