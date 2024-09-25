import { useMemo } from "react";
import { type UserPositionInfoWithId, type UserPositionInfo, Null } from "@icpswap/types";

import { useMultiPositionInfos, useMultiPositionInfosByIds } from "./useMultiPositionInfos";

export function usePositionInfo(
  poolId: string | undefined,
  principal: string | undefined,
): {
  loading: boolean;
  result: Array<UserPositionInfoWithId | undefined> | Null;
} {
  const { loading, result } = useMultiPositionInfos(poolId, [principal]);

  return useMemo(
    () => ({
      loading,
      result: result ? result[0] : null,
    }),
    [result, loading],
  );
}

export function usePositionInfosById(
  poolId: string | undefined,
  positionId: bigint | undefined,
): {
  loading: boolean;
  result: UserPositionInfo | Null;
} {
  const { loading, result } = useMultiPositionInfosByIds(poolId, [positionId]);

  return useMemo(
    () => ({
      loading,
      result: result ? result[0] : null,
    }),
    [result, loading],
  );
}
