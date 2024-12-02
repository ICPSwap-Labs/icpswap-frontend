import { formatTokenAmount, BigNumber } from "@icpswap/utils";
import { Price, Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { useAppSelector } from "store/hooks";
import { useMemo } from "react";
import { WRAPPED_ICP } from "constants/tokens";
import { network, NETWORK } from "constants/server";
import { useInfoToken } from "@icpswap/hooks";

export function useICPPrice(): number | undefined {
  const { ICPPriceList } = useAppSelector((state) => state.global);

  return useMemo(() => {
    if (ICPPriceList.length) {
      return ICPPriceList[ICPPriceList.length - 1].value;
    }

    return undefined;
  }, [ICPPriceList]);
}

export function useUSDPrice(currency: Token | undefined): string | number | undefined {
  const _currency = useMemo(() => {
    if (!currency) return undefined;
    if (currency?.wrapped.equals(WRAPPED_ICP) || currency?.wrapped.equals(ICP)) return undefined;
    return currency;
  }, [currency]);

  const graphToken = useInfoToken(_currency?.wrapped.address);

  const baseToken = useMemo(() => {
    return network === NETWORK.IC ? ICP : WRAPPED_ICP;
  }, [network, NETWORK]);

  const icpPriceNumber = useICPPrice();

  const baseTokenPrice = useMemo(() => {
    if (icpPriceNumber) {
      return new Price(
        baseToken,
        baseToken,
        formatTokenAmount(1, baseToken.decimals).toString(),
        formatTokenAmount(icpPriceNumber, baseToken.decimals).toString(),
      );
    }
    return undefined;
  }, [icpPriceNumber, baseToken]);

  return useMemo(() => {
    if (!currency || !baseTokenPrice) return undefined;

    if (currency?.wrapped.equals(ICP) || currency?.wrapped.equals(WRAPPED_ICP)) return baseTokenPrice.toFixed();

    if (graphToken) {
      return graphToken.priceUSD;
    }

    return undefined;
  }, [currency, baseToken, graphToken, baseTokenPrice]);
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
