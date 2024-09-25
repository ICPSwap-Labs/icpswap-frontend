import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useMemo } from "react";

export interface UseTokenSymbolProps {
  token: Token | Null;
  bridgeChain: ckBridgeChain | Null;
}

export function useTokenSymbol({ token, bridgeChain }: UseTokenSymbolProps) {
  return useMemo(() => {
    if (!token || !bridgeChain) return undefined;
    return bridgeChain === ckBridgeChain.icp ? token.symbol : token.symbol.replace("ck", "");
  }, [token, bridgeChain]);
}
