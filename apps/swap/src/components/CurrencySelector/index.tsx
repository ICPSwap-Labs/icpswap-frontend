import React, { useState, useMemo } from "react";
import CurrencySelectButton from "./button";
import Selector from "./selector";
import { TokenInfo } from "types/token";
import { Token } from "@icpswap/swap-sdk";
import { useTokenInfo } from "hooks/token/useTokenInfo";

export interface CurrencySelectorProps {
  currencyId: string | undefined;
  onChange: (token: TokenInfo) => void;
  disabledCurrency?: Token[];
  bgGray?: boolean;
  loading?: boolean;
  disabled?: boolean;
  activeCurrencies?: Token[];
  version?: "v2" | "v3";
}

export default function CurrencySelector({
  currencyId,
  onChange,
  disabledCurrency,
  activeCurrencies,
  bgGray = false,
  loading,
  disabled = false,
  version,
}: CurrencySelectorProps) {
  const [selectorShow, setSelectorShow] = useState(false);

  const onTokenChange = (token: TokenInfo) => {
    onChange && onChange(token);
    setSelectorShow(false);
  };

  const { result: tokenInfo } = useTokenInfo(currencyId);

  const disabledCurrencyIds = useMemo(() => {
    if (disabledCurrency && disabledCurrency.length) {
      return disabledCurrency.map((currency) => currency?.address);
    }
    return [];
  }, [disabledCurrency]);

  const activeCurrencyIds = useMemo(() => {
    if (activeCurrencies && activeCurrencies.length) {
      return activeCurrencies.map((currency) => currency?.address);
    }
    return [];
  }, [activeCurrencies]);

  return (
    <React.Fragment>
      <CurrencySelectButton
        currency={tokenInfo}
        onClick={() => {
          if (disabled) return;
          setSelectorShow(true);
        }}
        bgGray={bgGray}
        loading={loading}
        disabled
      />
      {selectorShow && (
        <Selector
          open={selectorShow}
          onClose={() => setSelectorShow(false)}
          onChange={onTokenChange}
          disabledCurrencyIds={disabledCurrencyIds}
          activeCurrencyIds={activeCurrencyIds}
          version={version}
        />
      )}
    </React.Fragment>
  );
}
