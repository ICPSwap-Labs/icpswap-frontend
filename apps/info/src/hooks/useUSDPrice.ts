import { Token, CurrencyAmount, FeeAmount } from "@icpswap/swap-sdk";
import { formatTokenAmount, resultFormat } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useMemo, useEffect, useState } from "react";
import { WRAPPED_ICP, ICP } from "@icpswap/tokens";
import { usePool } from "hooks/swap/usePools";
import { useICPPrice } from "store/global/hooks";
import { analyticToken } from "@icpswap/actor";
import { useToken } from "hooks/info/useToken";
import { PublicTokenOverview } from "@icpswap/types";

/**
 * Returns the price in USD of the input currency
 * @param currency currency to compute the USD price of
 */
export function useUSDPrice(tokenId: string | undefined): number | undefined {
  const icpPrice = useICPPrice();

  const graphToken = useToken(tokenId);

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

export function useInterfacePrice(currency: Token | undefined): BigNumber | undefined {
  const [amountOut, setAmountOut] = useState<CurrencyAmount<Token> | undefined>(undefined);

  const [, pool] = usePool(currency, ICP, FeeAmount.MEDIUM);

  const ICPPrice = useICPPrice();

  useEffect(() => {
    const call = async () => {
      if (pool && currency) {
        const [amountOut] = await pool.getOutputAmount(
          CurrencyAmount.fromRawAmount(currency.wrapped, formatTokenAmount(1, currency.decimals).toString()),
        );

        setAmountOut(amountOut);
      }
    };

    call();
  }, [currency, pool]);

  return useMemo(() => {
    if (!currency || !ICPPrice) {
      return undefined;
    }

    // handle ICP
    if (currency?.equals(WRAPPED_ICP) || currency?.equals(ICP)) {
      return new BigNumber(ICPPrice);
    }

    if (amountOut) {
      return new BigNumber(amountOut.toExact()).multipliedBy(ICPPrice);
    }

    return undefined;
  }, [currency, ICP, amountOut, ICPPrice]);
}

type Price = number | undefined;

export function useCurrenciesUSDPrice(currencies: (string | undefined)[]): Price[] {
  const icpPrice = useICPPrice();

  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    async function call() {
      const prices = await Promise.all(
        currencies?.map(async (currency) => {
          if (!currency || !icpPrice) return undefined;

          if (currency === ICP.address || currency === WRAPPED_ICP.address) {
            return Number(icpPrice.toString());
          }

          const graphToken = resultFormat<PublicTokenOverview>(await (await analyticToken()).getToken(currency)).data;

          if (graphToken) {
            return graphToken.priceUSD;
          }

          return undefined;
        }),
      );

      setPrices(prices);
    }

    if (!!icpPrice && !!currencies) {
      call();
    }
  }, [currencies, icpPrice, ICP]);

  return useMemo(() => prices, [prices]);
}

export function useUSDPriceById(tokenId: string | undefined): number | undefined {
  const _tokenId = useMemo(() => {
    if (!tokenId) return undefined;
    if (tokenId === WRAPPED_ICP.address || tokenId === ICP.address) return undefined;
    return tokenId;
  }, [tokenId]);

  const graphToken = useToken(_tokenId);

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
