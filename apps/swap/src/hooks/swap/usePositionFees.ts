import { useMemo } from "react";
import { usePositionFee } from "@icpswap/hooks";

export function usePositionFees(canisterId: string | undefined, positionId: bigint | undefined, reload?: boolean) {
  const { result } = usePositionFee(canisterId, positionId, reload);

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
