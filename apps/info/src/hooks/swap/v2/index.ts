import { useMemo, useCallback } from "react";
import { parseTokenAmount, formatTokenAmount, numberToString } from "@icpswap/utils";
import type { NumberType } from "@icpswap/types";
import { Currency } from "@icpswap/swap-sdk";
import { getTokenStandard, useUpdateTokenStandards } from "store/token/cache/hooks";
import { getSwapPoolTokenStandard } from "hooks/swap/v2/calls";

export function useActualSwapAmount(
  amount: NumberType | undefined,
  currency: Currency | undefined,
): string | undefined {
  return useMemo(() => {
    if (!amount || !currency) return undefined;

    const typedValue = formatTokenAmount(amount, currency.decimals);
    const fee = currency.transFee;

    if (typedValue.isGreaterThan(currency.transFee)) {
      return numberToString(parseTokenAmount(typedValue.minus(fee), currency.decimals));
    } else {
      return "0";
    }
  }, [amount, currency]);
}

export function useUpdatePoolTokenStandardCallback() {
  const updateTokenStandard = useUpdateTokenStandards();

  return useCallback(async (poolId: string, tokenId: string) => {
    if (!getTokenStandard(tokenId)) {
      const standard = await getSwapPoolTokenStandard(poolId, tokenId);
      updateTokenStandard({ canisterId: tokenId, standard });
    }
  }, []);
}

export * from "./useSwapNFTSvg";
