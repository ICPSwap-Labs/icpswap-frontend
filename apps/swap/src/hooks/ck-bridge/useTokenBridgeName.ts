import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";

export function useTokenBridgeName(token: Token | Null, chain: BridgeChainType | Null) {
  return useMemo(() => {
    if (isUndefinedOrNull(token) || isUndefinedOrNull(chain)) return undefined;

    return chain === BridgeChainType.icp ? token.name : token.name.replace("ck", "");
  }, [token, chain]);
}
