import { useCallback } from "react";
import { swapPool } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";

export function useQuotePrice(
  poolId: string | undefined,
  amountIn: string | undefined,
  zeroForOne: boolean | undefined,
) {
  return useCallsData(
    useCallback(async () => {
      if (!amountIn || zeroForOne === undefined || !poolId) return undefined;

      return resultFormat<bigint>(
        await (
          await swapPool(poolId!)
        ).quote({
          amountOutMinimum: "0",
          amountIn: amountIn!,
          zeroForOne: !zeroForOne,
        }),
      ).data;
    }, [amountIn, zeroForOne, poolId]),
  );
}
