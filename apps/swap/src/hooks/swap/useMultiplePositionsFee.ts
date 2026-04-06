import { getPositionsFee } from "@icpswap/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPositionFeeKey } from "utils/swap";

const DEFAULT_FEE_RESULT = { fees: [], poolId: undefined, positionIds: [] };

export interface UseMultiplePositionsFeeProps {
  data: { poolId: string; positionIds: bigint[] }[] | undefined;
  refresh?: number;
}

export function useMultiplePositionsFee({ data, refresh }: UseMultiplePositionsFeeProps) {
  const { data: positionsFee } = useQuery({
    queryKey: ["useMultiplePositionsFee", data, refresh],
    enabled: nonUndefinedOrNull(data),
    queryFn: async () => {
      if (isUndefinedOrNull(data)) return undefined;

      const allFees = await Promise.all(
        data.map(async ({ poolId, positionIds }) => {
          if (positionIds.length === 0) return DEFAULT_FEE_RESULT;
          if (isUndefinedOrNull(poolId)) return DEFAULT_FEE_RESULT;

          const fees = await getPositionsFee(poolId, positionIds);

          return {
            fees: fees.tokenIncome,
            poolId,
            positionIds,
          };
        }),
      );

      const positionsFee: Record<string, { fee0: bigint; fee1: bigint }> = {};

      allFees.forEach(({ poolId, fees }) => {
        fees.forEach(([positionId, { tokensOwed0, tokensOwed1 }]) => {
          if (nonUndefinedOrNull(poolId)) {
            const key = getPositionFeeKey(poolId, positionId);

            positionsFee[key] = {
              fee0: tokensOwed0,
              fee1: tokensOwed1,
            };
          }
        });
      });

      return positionsFee;
    },
  });

  return useMemo(() => positionsFee, [positionsFee]);
}
