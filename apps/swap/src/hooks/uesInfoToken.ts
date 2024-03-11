import { useCallback } from "react";
import { tokenStorage, node_index } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";
import type { PublicTokenOverview } from "@icpswap/types";

export async function getInfoToken(storageId: string, tokenId: string) {
  return resultFormat<PublicTokenOverview>(await (await tokenStorage(storageId)).getToken(tokenId)).data;
}

export function useInfoToken(tokenId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;

      const storageId = (await (await node_index()).tokenStorage(tokenId))[0];

      if (storageId) {
        return await getInfoToken(storageId, tokenId);
      }

      return undefined;
    }, [tokenId]),
  );
}
