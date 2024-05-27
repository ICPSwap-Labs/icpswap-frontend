import { useInfoTokenStorageIds, useStorageInfoToken } from "@icpswap/hooks";
import { useMemo } from "react";

export function useToken(canisterId: string | undefined) {
  const { result: storageIds } = useInfoTokenStorageIds(canisterId);

  const { result: graphToken } = useStorageInfoToken(storageIds ? storageIds[0] : undefined, canisterId);

  return useMemo(() => graphToken, [graphToken]);
}
