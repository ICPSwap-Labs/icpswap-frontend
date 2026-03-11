import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { BridgeChainType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export function useTokenBridgeName(token: Token | Null, chain: BridgeChainType | Null) {
  return useMemo(() => {
    if (isUndefinedOrNull(token) || isUndefinedOrNull(chain)) return undefined;

    return chain === BridgeChainType.icp ? token.name : token.name.replace("ck", "");
  }, [token, chain]);
}
