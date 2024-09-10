import { useMemo, useContext, useEffect, useCallback } from "react";
import { Box, useTheme } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { useSwapState, useSwapHandlers } from "store/swap/hooks";
import { BigNumber, isNullArgs, parseTokenAmount } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { UseCurrencyState } from "hooks/useCurrency";
import { TokenInfo } from "types/token";
import { SwapContext } from "components/swap/index";
import { Image } from "@icpswap/ui";
import { Null } from "@icpswap/types";

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
  inputToken: Token | undefined;
  outputToken: Token | undefined;
  inputCurrencyState: UseCurrencyState;
  outputCurrencyState: UseCurrencyState;
  ui?: "pro" | "normal";
  inputTokenUnusedBalance: bigint | Null;
  outputTokenUnusedBalance: bigint | Null;
  inputTokenSubBalance: BigNumber | Null;
  outputTokenSubBalance: BigNumber | Null;
  maxInputAmount: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
}

export function SwapInputWrapper({
  onInput,
  onMaxInput,
  onTokenAChange,
  onTokenBChange,
  tokenAPrice,
  tokenBPrice,
  parsedAmounts,
  currencyBalances,
  inputToken,
  outputToken,
  inputCurrencyState,
  outputCurrencyState,
  inputTokenUnusedBalance,
  outputTokenUnusedBalance,
  inputTokenSubBalance,
  outputTokenSubBalance,
  ui = "normal",
  maxInputAmount,
  noLiquidity,
}: SwapInputWrapperProps) {
  const theme = useTheme();
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

  const handleWalletBalanceClick = useCallback(() => {
    if (!inputToken || !currencyBalances[SWAP_FIELD.INPUT]) return undefined;

    onInput(
      new BigNumber(currencyBalances[SWAP_FIELD.INPUT].toExact())
        .minus(parseTokenAmount(inputToken.transFee, inputToken.decimals))
        .toString(),
      "input",
    );
  }, [inputToken, onInput, currencyBalances[SWAP_FIELD.INPUT]]);

  const handleCanisterBalanceClick = useCallback(() => {
    if (!inputToken || isNullArgs(inputTokenSubBalance) || isNullArgs(inputTokenUnusedBalance)) return undefined;

    if (inputTokenSubBalance.isEqualTo(0)) {
      onInput(parseTokenAmount(inputTokenUnusedBalance, inputToken.decimals).toString(), "input");
    } else {
      onInput(
        parseTokenAmount(inputTokenUnusedBalance, inputToken.decimals)
          .plus(parseTokenAmount(inputTokenSubBalance.minus(inputToken.transFee), inputToken.decimals))
          .toString(),
        "input",
      );
    }
  }, [inputToken, onInput, inputTokenSubBalance, inputTokenUnusedBalance]);

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <SwapInputCurrency
          noLiquidity={noLiquidity}
          currency={inputToken}
          currencyPrice={tokenAPrice}
          formattedAmount={formattedAmounts[SWAP_FIELD.INPUT]}
          currencyBalance={currencyBalances[SWAP_FIELD.INPUT]}
          onMax={onMaxInput}
          onInput={(value: string) => onInput(value, "input")}
          onTokenChange={onTokenAChange}
          currencyState={inputCurrencyState}
          parsedAmount={parsedAmounts[SWAP_FIELD.INPUT]}
          background={ui === "pro" ? "level1" : "level3"}
          unusedBalance={inputTokenUnusedBalance}
          subBalance={inputTokenSubBalance}
          isInput
          onWalletBalanceClick={handleWalletBalanceClick}
          onCanisterBalanceClick={handleCanisterBalanceClick}
          maxInputAmount={maxInputAmount}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "-17px",
            left: "50%",
            transform: "translate(-50%, 0)",
            cursor: "pointer",
            overflow: "hidden",
            width: "32px",
            height: "32px",
            background: ui === "pro" ? theme.palette.background.level3 : theme.palette.background.level1,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onSwitchTokens}
        >
          <Image
            src={ui === "pro" ? "/images/icon_exchange_pro.png" : "/images/icon_exchange.png"}
            sx={{ width: "28px", height: "28px" }}
          />
        </Box>
      </Box>

      <Box sx={{ marginTop: "6px" }}>
        <SwapInputCurrency
          currency={outputToken}
          currencyPrice={tokenBPrice}
          formattedAmount={formattedAmounts[SWAP_FIELD.OUTPUT]}
          currencyBalance={currencyBalances[SWAP_FIELD.OUTPUT]}
          onInput={(value: string) => onInput(value, "output")}
          onTokenChange={onTokenBChange}
          currencyState={outputCurrencyState}
          parsedAmount={parsedAmounts[SWAP_FIELD.OUTPUT]}
          usdChange={USDChange}
          background={ui === "pro" ? "level1" : "level3"}
          disabled
          unusedBalance={outputTokenUnusedBalance}
          subBalance={outputTokenSubBalance}
        />
      </Box>
    </Box>
  );
}
