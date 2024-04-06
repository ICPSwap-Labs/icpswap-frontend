import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { WRAPPED_ICP, ICP } from "@icpswap/tokens";
import { useICPPrice } from "store/global/hooks";
import { useInfoToken } from "hooks/info/useInfoTokens";

/**
 * Returns the price in USD of the input currency
 * @param currency currency to compute the USD price of
 */
export function useUSDPrice(tokenId: string | undefined): number | undefined {
  const icpPrice = useICPPrice();

  const graphToken = useInfoToken(tokenId);

  return useMemo(() => {
    if (!tokenId) return undefined;

    if (tokenId === ICP.address || tokenId === WRAPPED_ICP.address) {
      return icpPrice;
    }

    if (graphToken) {
      return graphToken.priceUSD;
    }

    return undefined;
  }, [tokenId, ICP, icpPrice, graphToken]);
}

export function useUSDValue(currencyAmount: CurrencyAmount<Token> | undefined) {
  const price = useUSDPrice(currencyAmount?.currency.wrapped.address);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return new BigNumber(price).multipliedBy(currencyAmount.toFixed()).toFixed();
    } catch (error) {
      return null;
    }
  }, [currencyAmount, price]);
}

export function useUSDPriceById(tokenId: string | undefined): number | undefined {
  const _tokenId = useMemo(() => {
    if (!tokenId) return undefined;
    if (tokenId === WRAPPED_ICP.address || tokenId === ICP.address) return undefined;
    return tokenId;
  }, [tokenId]);

  const graphToken = useInfoToken(_tokenId);

  const icpPriceNumber = useICPPrice();

  return useMemo(() => {
    if (!tokenId || !icpPriceNumber) return undefined;

    if (tokenId === ICP.address || tokenId === WRAPPED_ICP.address) return icpPriceNumber;

    if (graphToken) {
      return graphToken.priceUSD;
    }

    return undefined;
  }, [tokenId, graphToken, icpPriceNumber]);
}
