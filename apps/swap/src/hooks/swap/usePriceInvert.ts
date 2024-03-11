import { useMemo } from "react";
import { Position } from "@icpswap/swap-sdk";
import { Bound } from "constants/swap";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";

export function useTicksAtLimitInvert({ position, inverted }: { position: Position; inverted?: boolean }) {
  const { tickLower, tickUpper } = position || {};

  const feeAmount = position?.pool.fee;

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  return tickAtLimit;
}
