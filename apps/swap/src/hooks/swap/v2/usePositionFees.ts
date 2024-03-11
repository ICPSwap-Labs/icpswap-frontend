import { useMemo } from "react";
import { usePositionFeesCall } from "hooks/swap/v2/useSwapCalls";

export function usePositionFees(positionId: bigint | string | number | undefined, invalid: boolean, reload?: boolean) {
  const { result } = usePositionFeesCall(positionId, invalid, reload);

  return useMemo(() => {
    if (!result)
      return {
        amount0: undefined,
        amount1: undefined,
      };

    return {
      amount0: result.amount0,
      amount1: result.amount1,
    };
  }, [result]);
}
