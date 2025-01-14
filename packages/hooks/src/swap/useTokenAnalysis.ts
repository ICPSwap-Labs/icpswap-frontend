import { isNullArgs, resultFormat } from "@icpswap/utils";
import { useCallback } from "react";
import type { Null, TokenAnalysisData } from "@icpswap/types";
import { tokenAnalysis } from "@icpswap/actor";

import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

export async function getTokenAnalysis(canisterId: string | Null) {
  const result = await (await tokenAnalysis()).getTokenData(Principal.fromText(canisterId));
  return resultFormat<TokenAnalysisData>(result).data;
}

export function useTokenAnalysis(canisterId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(canisterId)) return undefined;
      return await getTokenAnalysis(canisterId);
    }, [canisterId]),
  );
}
