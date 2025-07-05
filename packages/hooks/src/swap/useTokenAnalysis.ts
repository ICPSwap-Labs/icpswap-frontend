import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { useCallback } from "react";
import type { Null, TokenResponse } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getTokenAnalysis(canisterId: string) {
  const result = await icpswap_fetch_post<TokenResponse>("/token/data", { pid: canisterId });
  return result?.data;
}

export function useTokenAnalysis(canisterId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(canisterId)) return undefined;
      return await getTokenAnalysis(canisterId);
    }, [canisterId]),
  );
}
