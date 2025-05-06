import { useCallback } from "react";
import { IcpSwapAPITokenDetail, Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useTokenDetails(tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;

      const result = await icpswap_fetch_post<IcpSwapAPITokenDetail>(`/info/tokens/detail`, {
        ledgerId: tokenId,
      });

      return result?.data;
    }, [tokenId]),
  );
}
