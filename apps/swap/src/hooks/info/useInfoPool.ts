import { useInfoPoolStorageIds, useInfoPool } from "@icpswap/hooks";

export function usePool(poolId: string | undefined) {
  const { result: storageId } = useInfoPoolStorageIds(poolId);

  return useInfoPool(storageId ? storageId[0] : undefined, poolId);
}
