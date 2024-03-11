import { formatTokenAmount } from "@icpswap/utils";
import { Price, Currency, CurrencyAmount, FeeAmount, Pool } from "@icpswap/swap-sdk";
import { useAppSelector } from "store/hooks";
import { useMemo, useState, useEffect } from "react";
import { WRAPPED_ICP, ICP } from "constants/tokens";
import { usePool } from "hooks/swap/usePools";
import { network, NETWORK } from "constants/server";
import { useInfoToken } from "hooks/swap/useInfoToken";
import BigNumber from "bignumber.js";

export function useICPPrice(): number | undefined {
  const { ICPPriceList } = useAppSelector((state) => state.global);

  return useMemo(() => {
    if (ICPPriceList.length) {
      return ICPPriceList[ICPPriceList.length - 1]["value"];
    }

    return undefined;
  }, [ICPPriceList]);
}

export function useUSDPrice(currency: Currency | undefined): string | number | undefined {
  const _currency = useMemo(() => {
    if (!currency) return undefined;
    if (currency?.wrapped.equals(WRAPPED_ICP) || currency?.wrapped.equals(ICP)) return undefined;
    return currency;
  }, [currency]);

  const { result: graphToken } = useInfoToken(_currency?.wrapped.address);

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
  const _tokenId = useMemo(() => {
    if (!tokenId) return undefined;
    if (tokenId === WRAPPED_ICP.address || tokenId === ICP.address) return undefined;
    return tokenId;
  }, [tokenId]);

  const { result: graphToken } = useInfoToken(_tokenId);

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

export function useUSDValue(currencyAmount: CurrencyAmount<Currency> | undefined) {
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

export function useInterfacePrice(currency: Currency | undefined): BigNumber | undefined {
  const [amountOut, setAmountOut] = useState<CurrencyAmount<Currency> | undefined>(undefined);

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
  }, [currency, ICP, pool]);

  return useMemo(() => {
    if (!currency || !ICPPrice) {
      return undefined;
    }

    // handle ICP
    if (currency?.wrapped.equals(WRAPPED_ICP) || currency?.wrapped.equals(ICP)) {
      return new BigNumber(ICPPrice);
    }

    if (amountOut) {
      return new BigNumber(amountOut.toExact()).multipliedBy(ICPPrice);
    }

    return undefined;
  }, [currency, WRAPPED_ICP, amountOut, ICPPrice]);
}

export function useInterfacePriceFromPool(
  pool: Pool | undefined | null,
  currency: Currency | undefined,
): BigNumber | undefined {
  const [amountOut, setAmountOut] = useState<CurrencyAmount<Currency> | undefined>(undefined);

  const ICPPrice = useICPPrice();

  useEffect(() => {
    const call = async () => {
      if (pool && currency && !currency.equals(WRAPPED_ICP.wrapped)) {
        const [amountOut] = await pool.getOutputAmount(
          CurrencyAmount.fromRawAmount(currency.wrapped, formatTokenAmount(1, currency.decimals).toString()),
        );

        setAmountOut(amountOut);
      }
    };

    call();
  }, [currency, WRAPPED_ICP, pool]);

  return useMemo(() => {
    if (!currency || !ICPPrice) {
      return undefined;
    }

    // handle ICP
    if (currency?.wrapped.equals(WRAPPED_ICP) || currency?.wrapped.equals(ICP)) {
      return new BigNumber(ICPPrice);
    }

    if (amountOut) {
      return new BigNumber(amountOut.toExact()).multipliedBy(ICPPrice);
    }

    return undefined;
  }, [currency, WRAPPED_ICP, amountOut, ICPPrice]);
}
