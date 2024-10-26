import { useMemo } from "react";
import { isNullArgs } from "@icpswap/utils";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export function useTokenBridgeName(token: Token | Null, chain: ckBridgeChain | Null) {
  return useMemo(() => {
    if (isNullArgs(token) || isNullArgs(chain)) return undefined;

    return chain === ckBridgeChain.icp ? token.name : token.name.replace("ck", "");
  }, [token, chain]);
}
