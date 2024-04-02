import { useMemo } from "react";
import { usePositionFee } from "@icpswap/hooks";

export function usePositionFees(
  canisterId: string | undefined,
  positionId: bigint | undefined,
  refresh?: number | boolean,
) {
  const { result } = usePositionFee(canisterId, positionId, refresh);

  return useMemo(() => {
    if (!result)
      return {
        amount0: undefined,
        amount1: undefined,
      };

    return {
      amount0: result.tokensOwed0,
      amount1: result.tokensOwed1,
    };
  }, [result]);
}
