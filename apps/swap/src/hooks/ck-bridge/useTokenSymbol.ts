import { BridgeChainType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useMemo } from "react";

export interface UseTokenSymbolProps {
  token: Token | Null;
  chain: BridgeChainType | Null;
}

export function useTokenSymbol({ token, chain }: UseTokenSymbolProps) {
  return useMemo(() => {
    if (!token || !chain) return undefined;

    return chain === BridgeChainType.icp ? token.symbol : token.symbol.replace("ck", "");
  }, [token, chain]);
}
