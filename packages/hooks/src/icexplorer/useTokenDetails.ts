import { useCallback } from "react";
import { IcExplorerTokenDetail, Null } from "@icpswap/types";
import { fetch_post } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useExplorerTokenDetails(tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;
      return (
        await fetch_post<IcExplorerTokenDetail>(`https://api.icexplorer.io/api/token/detail`, { ledgerId: tokenId })
      ).data;
    }, [tokenId]),
  );
}
