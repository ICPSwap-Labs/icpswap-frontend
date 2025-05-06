import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useTokenBurned(tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;
      return (await icpswap_fetch_post<string>(`/info/tokens/burned`, { ledgerId: tokenId }))?.data;
    }, [tokenId]),
  );
}
