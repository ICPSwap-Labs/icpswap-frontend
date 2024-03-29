import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";

export function useAllCurrencyCombinations(tokenA: Token | undefined, tokenB: Token | undefined): Token[][] {
  return useMemo(() => {
    return tokenA && tokenB
      ? [[tokenA, tokenB]]
          .filter((tokens) => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
      : [];
  }, [tokenA, tokenB]);
}
