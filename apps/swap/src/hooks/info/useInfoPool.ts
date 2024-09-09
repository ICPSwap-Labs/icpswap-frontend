import { useInfoPoolStorageIds, useInfoPool as __useInfoPool } from "@icpswap/hooks";

export function useInfoPool(poolId: string | undefined) {
  const { result: storageId } = useInfoPoolStorageIds(poolId);
  return __useInfoPool(storageId ? storageId[0] : undefined, poolId);
}
