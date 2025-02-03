import { useMemo } from "react";
import type { Null } from "@icpswap/types";
import { isNullArgs } from "@icpswap/utils";
import { useTokenStandard } from "store/token/cache/hooks";

import { useIsSnsToken } from "./useTokenInSNS";

export function useTokenImportToNns(tokenId: string | Null) {
  const isSnsToken = useIsSnsToken(tokenId);
  const tokenStandard = useTokenStandard(tokenId);

  return useMemo(() => {
    if (isNullArgs(isSnsToken) || isNullArgs(tokenStandard) || isNullArgs(tokenId)) return false;

    return isSnsToken === false && tokenStandard.includes("ICRC");
  }, [tokenId, isSnsToken, tokenStandard]);
}
