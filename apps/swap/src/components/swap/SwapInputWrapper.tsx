import { useMemo, useContext, useEffect } from "react";
import { Box } from "@mui/material";
import SwitchIcon from "assets/images/swap/switch";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { useSwapState, useSwapHandlers } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { SWAP_FIELD } from "constants/swap";
import { UseCurrencyState } from "hooks/useCurrency";
import { TokenInfo } from "types/token";
import { SwapContext } from "components/swap/index";

import { SwapInputCurrency } from "./SwapInputCurrency";

export interface SwapInputWrapperProps {
  onInput: (value: string, type: "input" | "output") => void;
  onMaxInput: () => void;
  onTokenAChange: (token: TokenInfo) => void;
  onTokenBChange: (token: TokenInfo) => void;
  tokenAPrice: string | number | undefined;
  tokenBPrice: string | number | undefined;
  parsedAmounts: {
    INPUT: CurrencyAmount<Token> | undefined;
    OUTPUT: CurrencyAmount<Token> | undefined;
  };
  tradePoolId: string | undefined;
  currencyBalances: {
    INPUT: CurrencyAmount<Token> | undefined;
    OUTPUT: CurrencyAmount<Token> | undefined;
  };
  inputCurrency: Token | undefined;
  outputCurrency: Token | undefined;
  inputCurrencyState: UseCurrencyState;
  outputCurrencyState: UseCurrencyState;
  ui?: "pro" | "normal";
}

export function SwapInputWrapper({
  onInput,
  onMaxInput,
  onTokenAChange,
  onTokenBChange,
  tokenAPrice,
  tokenBPrice,
  parsedAmounts,
  tradePoolId,
  currencyBalances,
  inputCurrency,
  outputCurrency,
  inputCurrencyState,
  outputCurrencyState,
  ui = "normal",
}: SwapInputWrapperProps) {
  const { independentField, typedValue } = useSwapState();
  const { setUSDValueChange } = useContext(SwapContext);
  const { onSwitchTokens } = useSwapHandlers();

  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6),
  };

  const inputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.INPUT];
    if (!tokenAPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(tokenAPrice).toNumber();
  }, [tokenAPrice, formattedAmounts]);

  const outputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.OUTPUT];
    if (!tokenBPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(tokenBPrice).toNumber();
  }, [tokenBPrice, formattedAmounts]);

  const USDChange = useMemo(() => {
    return !!outputBalanceUSDValue && !!inputBalanceUSDValue
      ? new BigNumber(outputBalanceUSDValue)
          .minus(inputBalanceUSDValue)
          .dividedBy(inputBalanceUSDValue)
          .multipliedBy(100)
          .toFixed(2)
      : null;
  }, [outputBalanceUSDValue, inputBalanceUSDValue]);

  useEffect(() => {
    setUSDValueChange(USDChange);
  }, [setUSDValueChange, USDChange]);

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <SwapInputCurrency
          currency={inputCurrency}
          currencyPrice={tokenAPrice}
          formatAmount={formattedAmounts[SWAP_FIELD.INPUT]}
          currencyBalance={currencyBalances[SWAP_FIELD.INPUT]}
          onMax={onMaxInput}
          onInput={(value: string) => onInput(value, "input")}
          onTokenChange={onTokenAChange}
          tradePoolId={tradePoolId}
          currencyState={inputCurrencyState}
          parsedAmount={parsedAmounts[SWAP_FIELD.INPUT]}
          background={ui === "pro" ? "level1" : "level3"}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "-17px",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "30px",
            height: "31px",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={onSwitchTokens}
        >
          <SwitchIcon />
        </Box>
      </Box>

      <Box sx={{ marginTop: "8px" }}>
        <SwapInputCurrency
          currency={outputCurrency}
          currencyPrice={tokenBPrice}
          formatAmount={formattedAmounts[SWAP_FIELD.OUTPUT]}
          currencyBalance={currencyBalances[SWAP_FIELD.OUTPUT]}
          onInput={(value: string) => onInput(value, "output")}
          onTokenChange={onTokenBChange}
          tradePoolId={tradePoolId}
          currencyState={outputCurrencyState}
          parsedAmount={parsedAmounts[SWAP_FIELD.OUTPUT]}
          usdChange={USDChange}
          background={ui === "pro" ? "level1" : "level3"}
          disabled
        />
      </Box>
    </Box>
  );
}
