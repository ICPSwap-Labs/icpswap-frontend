import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useExplorerTokenBurned(tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;
      return (await fetch_post<string>(`https://api.icexplorer.io/api/token/burned`, { ledgerId: tokenId }))?.data;
    }, [tokenId]),
  );
}
