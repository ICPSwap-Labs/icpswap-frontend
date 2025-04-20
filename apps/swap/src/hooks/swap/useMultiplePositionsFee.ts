import { getPositionsFee } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { getPositionFeeKey } from "utils/swap";

export interface UseMultiplePositionsFeeProps {
  data: { poolId: string; positionIds: bigint[] }[] | undefined;
}

export function useMultiplePositionsFee({ data }: UseMultiplePositionsFeeProps) {
  const [positionsFee, setPositionsFee] = useState<{ [key: string]: { fee0: bigint; fee1: bigint } } | undefined>(
    undefined,
  );

  useEffect(() => {
    async function call() {
      if (data) {
        const allFees = await Promise.all(
          data.map(async ({ poolId, positionIds }) => {
            const fees = await getPositionsFee(poolId, positionIds);
            return {
              fees: fees.tokenIncome,
              poolId,
              positionIds,
            };
          }),
        );

        allFees.forEach(({ poolId, fees }) => {
          fees.forEach(([positionId, { tokensOwed0, tokensOwed1 }]) => {
            const key = getPositionFeeKey(poolId, positionId);
            setPositionsFee((prevState) => ({
              ...prevState,
              [key]: {
                fee0: tokensOwed0,
                fee1: tokensOwed1,
              },
            }));
          });
        });
      }
    }

    call();
  }, [JSON.stringify(data)]);

  return useMemo(() => positionsFee, [positionsFee]);
}
