import { useMemo } from "react";
import { Currency, Token } from "@icpswap/swap-sdk";

export function useAllCurrencyCombinations(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): Token[][] {
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped];

  return useMemo(() => {
    return tokenA && tokenB
      ? [[tokenA, tokenB]]
          .filter((tokens) => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
      : [];
  }, [tokenA, tokenB]);
}
