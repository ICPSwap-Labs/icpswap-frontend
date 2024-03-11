import { useInfoTokenStorageIds, useInfoToken } from "@icpswap/hooks";
import { useMemo } from "react";

export function useToken(canisterId: string | undefined) {
  const { result: storageIds } = useInfoTokenStorageIds(canisterId);

  const { result: graphToken } = useInfoToken(storageIds ? storageIds[0] : undefined, canisterId);

  return useMemo(() => graphToken, [graphToken]);
}
