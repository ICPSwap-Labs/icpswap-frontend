import type { Null, UserPositionInfo, UserPositionInfoWithId } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";

import { getSwapPosition, getSwapUserPositions } from "./calls";

export interface useMultiPositionInfosResults {
  loading: boolean;
  result: Array<UserPositionInfoWithId[] | undefined> | null;
}

export function useMultiPositionInfos(
  poolId: string | Null,
  principals: (string | undefined)[] | Null,
): useMultiPositionInfosResults {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Array<UserPositionInfoWithId[] | undefined> | null>(null);

  useEffect(() => {
    if (!poolId) {
      setLoading(false);
      return;
    }
    if (!principals || principals.length === 0) {
      setLoading(false);
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);

    Promise.all(
      principals.map((principal) => (principal ? getSwapUserPositions(poolId, principal) : Promise.resolve(undefined))),
    )
      .then(setResult)
      .finally(() => setLoading(false));
  }, [principals, poolId]);

  return useMemo(() => ({ loading, result }), [loading, result]);
}

export function useMultiPositionInfosByIds(
  poolId: string | undefined,
  positionIds: (bigint | undefined)[] | undefined,
): {
  loading: boolean;
  result: Array<UserPositionInfo | undefined> | null;
} {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Array<UserPositionInfo | undefined> | null>(null);

  useEffect(() => {
    if (!poolId) {
      setLoading(false);
      return;
    }
    if (!positionIds || positionIds.length === 0) {
      setLoading(false);
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);

    Promise.all(
      positionIds.map((positionId) =>
        positionId != null ? getSwapPosition(poolId, positionId) : Promise.resolve(undefined),
      ),
    )
      .then(setResult)
      .finally(() => setLoading(false));
  }, [positionIds, poolId]);

  return useMemo(() => ({ loading, result }), [loading, result]);
}
