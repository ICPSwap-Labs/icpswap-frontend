import { useCallback } from "react";
import { IcpSwapAPIPageResult, IcpSwapAPITokenHolderDetail, Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useTokenHolders(tokenId: string | Null, pageNum: number, pageSize: number, isDesc = true) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;

      const result = await icpswap_fetch_post<IcpSwapAPIPageResult<IcpSwapAPITokenHolderDetail>>(`/info/holder/token`, {
        ledgerId: tokenId,
        page: pageNum,
        size: pageSize,
        isDesc,
      });

      return result?.data;
    }, [tokenId, pageNum, pageSize, isDesc]),
  );
}
