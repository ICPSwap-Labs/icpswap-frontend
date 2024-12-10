import { BigNumber, isNullArgs } from "@icpswap/utils";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { useMemo } from "react";
import { WRAPPED_ICP } from "constants/tokens";
import { useInfoToken } from "@icpswap/hooks";

export function useICPPrice(): number | undefined {
  const icpTokenInfo = useInfoToken(ICP.address);

  return useMemo(() => {
    return icpTokenInfo?.priceUSD;
  }, [icpTokenInfo]);
}

export function useUSDPrice(token: Token | undefined): string | number | undefined {
  const tokenId = useMemo(() => {
    if (isNullArgs(token)) return null;

    if (token.address === WRAPPED_ICP.address) return ICP.address;

    return token.address;
  }, [token]);

  const graphToken = useInfoToken(tokenId);

  return useMemo(() => {
    if (!tokenId) return undefined;

    return graphToken?.priceUSD;
  }, [tokenId, graphToken]);
}

export function useUSDPriceById(tokenId: string | undefined): number | undefined {
  const graphToken = useInfoToken(tokenId);

  return useMemo(() => {
    if (!tokenId) return undefined;

    if (graphToken) {
      return graphToken.priceUSD;
    }

    return undefined;
  }, [tokenId, graphToken]);
}

export function useUSDValue(currencyAmount: CurrencyAmount<Token> | undefined) {
  const price = useUSDPrice(currencyAmount?.currency);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return new BigNumber(price).multipliedBy(currencyAmount.toExact());
    } catch (error) {
      return null;
    }
  }, [currencyAmount, price]);
}
