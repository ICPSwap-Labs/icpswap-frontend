import { useMemo } from "react";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { ckBTC, ckETH, ckUSDC, ICP } from "@icpswap/tokens";
import { useTokenStandard } from "store/token/cache/hooks";

import { useIsSnsToken } from "./useTokenInSNS";

const ImportedTokens = [ICP.address, ckBTC.address, ckUSDC.address, ckETH.address];

export function useTokenImportToNns(tokenId: string | Null) {
  const isSnsToken = useIsSnsToken(tokenId);
  const tokenStandard = useTokenStandard(tokenId);

  return useMemo(() => {
    if (isUndefinedOrNull(isSnsToken) || isUndefinedOrNull(tokenStandard) || isUndefinedOrNull(tokenId)) return false;

    return isSnsToken === false && tokenStandard.includes("ICRC") && !ImportedTokens.includes(tokenId);
  }, [tokenId, isSnsToken, tokenStandard]);
}
