import { useInfoPoolsOfToken, useInfoTokenStorageIds } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { Null } from "@icpswap/types";
import { isNullArgs } from "@icpswap/utils";
import { useMemo } from "react";

export function useTokenDexScreener(tokenId: string | Null) {
  const { result: storageIds } = useInfoTokenStorageIds(tokenId);

  const storageId = useMemo(() => {
    return storageIds ? storageIds[0] : undefined;
  }, [storageIds]);

  const { result: tokenPools } = useInfoPoolsOfToken(storageId, tokenId);

  return useMemo(() => {
    if (isNullArgs(tokenId) || isNullArgs(tokenPools)) return undefined;

    const poolWithICP = tokenPools.find((e) => {
      if (e.token0Id === tokenId) {
        return e.token1Id === ICP.address;
      }

      if (e.token1Id === tokenId) {
        return e.token0Id === ICP.address;
      }

      return false;
    });

    return poolWithICP?.pool ?? tokenId;
  }, [tokenPools, tokenId]);
}
