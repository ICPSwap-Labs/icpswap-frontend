import { useEffect, useMemo, useState } from "react";
import { type UserPositionInfoWithId } from "@icpswap/types";

import { getSwapUserPositions } from "./calls";

export function useMultiPositionInfos(
  poolId: string | undefined,
  principals: (string | undefined)[] | undefined,
): {
  loading: boolean;
  result: Array<UserPositionInfoWithId[] | undefined> | null;
} {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | Array<UserPositionInfoWithId[]>>(null);

  useEffect(() => {
    async function call() {
      setResult(null);

      if (principals && poolId) {
        const allResult: Array<UserPositionInfoWithId[] | undefined> = await Promise.all(
          principals.map(async (principal) => {
            if (!principal) return undefined;
            return await getSwapUserPositions(poolId, principal.toString());
          }),
        );

        setResult(allResult);
        setLoading(false);
      }

      if (principals && principals.length === 0 && poolId) {
        setLoading(false);
      }
    }

    call();
  }, [principals, poolId]);

  return useMemo(
    () => ({
      loading,
      result,
    }),
    [result, loading],
  );
}
