import { useCallback } from "react";
import { IcExplorerPagination, IcExplorerTokenHolderDetail, Null } from "@icpswap/types";
import { fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useExplorerTokenHolders(tokenId: string | Null, pageNum: number, pageSize: number, isDesc = true) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;

      const result = await fetch_post<IcExplorerPagination<IcExplorerTokenHolderDetail>>(
        `https://api.icexplorer.io/api/holder/token`,
        {
          ledgerId: tokenId,
          page: pageNum,
          size: pageSize,
          isDesc,
        },
      );

      return result?.data;
    }, [tokenId, pageNum, pageSize, isDesc]),
  );
}
