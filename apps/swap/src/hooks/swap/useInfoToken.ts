import { useCallback } from "react";
import { node_index, tokenStorage } from "@icpswap/actor";
import { useCallsData } from "@icpswap/hooks";
import { type PublicTokenOverview } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";

export async function getInfoToken(storageId: string, tokenId: string) {
  return resultFormat<PublicTokenOverview>(await (await tokenStorage(storageId)).getToken(tokenId)).data;
}

export function useInfoToken(tokenId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;

      const storageIds = await (await node_index()).tokenStorage(tokenId);

      const latestStorageId = storageIds[storageIds.length - 1];

      if (latestStorageId) {
        return await getInfoToken(latestStorageId, tokenId);
      }

      return undefined;
    }, [tokenId]),
  );
}
