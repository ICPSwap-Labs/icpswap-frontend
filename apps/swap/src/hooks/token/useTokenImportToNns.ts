import { useMemo } from "react";
import type { Null } from "@icpswap/types";
import { isNullArgs } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { useTokenStandard } from "store/token/cache/hooks";
import { useBridgeTokens } from "store/global/hooks";

import { useIsSnsToken } from "./useTokenInSNS";

export function useTokenImportToNns(tokenId: string | Null) {
  const isSnsToken = useIsSnsToken(tokenId);
  const tokenStandard = useTokenStandard(tokenId);
  const bridgeTokens = useBridgeTokens();

  return useMemo(() => {
    if (isNullArgs(isSnsToken) || isNullArgs(tokenStandard) || isNullArgs(tokenId)) return false;

    return (
      isSnsToken === false &&
      tokenStandard.includes("ICRC") &&
      tokenId !== ICP.address &&
      !bridgeTokens.includes(tokenId)
    );
  }, [tokenId, isSnsToken, tokenStandard, bridgeTokens]);
}
