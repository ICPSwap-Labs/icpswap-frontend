import { useInfoToken } from "@icpswap/hooks";
import type { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import type { Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { WRAPPED_ICP } from "constants/tokens";
import { useMemo } from "react";
import { useToken } from "hooks/index";

export function useICPPrice(): number | undefined {
  const icpTokenInfo = useInfoToken(ICP.address);

  return useMemo(() => {
    if (!icpTokenInfo) return undefined;
    return icpTokenInfo.price ? Number(icpTokenInfo.price) : undefined;
  }, [icpTokenInfo]);
}

export function useUSDPrice(token: Token | Null): string | number | undefined {
  const tokenId = useMemo(() => {
    if (isUndefinedOrNull(token)) return null;

    if (token.address === WRAPPED_ICP.address) return ICP.address;

    return token.address;
  }, [token]);

  const tokenInfo = useInfoToken(tokenId);

  return useMemo(() => {
    if (!tokenId) return undefined;

    return tokenInfo?.price;
  }, [tokenId, tokenInfo]);
}

export function useUSDPriceById(tokenId: string | undefined) {
  const [, token] = useToken(tokenId);
  return useUSDPrice(token);
}

export function useUSDValue(currencyAmount: CurrencyAmount<Token> | undefined) {
  const price = useUSDPrice(currencyAmount?.currency);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return new BigNumber(price).multipliedBy(currencyAmount.toExact());
    } catch (_error) {
      return null;
    }
  }, [currencyAmount, price]);
}
