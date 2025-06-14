import { useMemo, useContext, useEffect, useCallback } from "react";
import { Box, useTheme } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { useSwapState, useSwapHandlers } from "store/swap/hooks";
import { BigNumber } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { UseCurrencyState } from "hooks/useCurrency";
import { SwapContext } from "components/swap/index";
import { Image } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useHistory } from "react-router-dom";
import { SwapInputCurrency } from "components/swap/SwapInputCurrency";
import { useParsedQueryString } from "@icpswap/hooks";

export interface SwapInputWrapperProps {
  onInput: (value: string, type: "input" | "output") => void;
  onMaxInput: () => void;
  onTokenAChange: (token: Token) => void;
  onTokenBChange: (token: Token) => void;
  inputTokenPrice: string | number | undefined;
  outputTokenPrice: string | number | undefined;
  parsedAmounts: {
    INPUT: CurrencyAmount<Token> | undefined;
    OUTPUT: CurrencyAmount<Token> | undefined;
  };
  poolId: string | undefined;
  currencyBalances: {
    [key: string]: CurrencyAmount<Token> | undefined;
  };
  inputToken: Token | undefined;
  outputToken: Token | undefined;
  inputTokenState: UseCurrencyState;
  outputTokenState: UseCurrencyState;
  ui?: "pro" | "normal";
  inputTokenUnusedBalance: bigint | Null;
  outputTokenUnusedBalance: bigint | Null;
  inputTokenSubBalance: string | Null;
  outputTokenSubBalance: string | Null;
  maxInputAmount: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
}

export function SwapInputWrapper({
  onInput,
  onMaxInput,
  onTokenAChange,
  onTokenBChange,
  inputTokenPrice,
  outputTokenPrice,
  parsedAmounts,
  currencyBalances,
  inputToken,
  outputToken,
  inputTokenState,
  outputTokenState,
  inputTokenUnusedBalance,
  outputTokenUnusedBalance,
  inputTokenSubBalance,
  outputTokenSubBalance,
  ui = "normal",
  maxInputAmount,
  noLiquidity,
  poolId,
}: SwapInputWrapperProps) {
  const history = useHistory();
  const theme = useTheme();
  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: inputTokenId,
    [SWAP_FIELD.OUTPUT]: outputTokenId,
  } = useSwapState();
  const { setUSDValueChange } = useContext(SwapContext);
  const { onSwitchTokens } = useSwapHandlers();
  const { tab: swapProTab } = useParsedQueryString() as { tab: string };

  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6),
  };

  const inputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.INPUT];
    if (!inputTokenPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(inputTokenPrice).toNumber();
  }, [inputTokenPrice, formattedAmounts]);

  const outputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.OUTPUT];
    if (!outputTokenPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(outputTokenPrice).toNumber();
  }, [outputTokenPrice, formattedAmounts]);

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

  const handleSwitchTokens = useCallback(() => {
    const prePath = ui === "pro" ? "/swap/pro" : "/swap";
    history.push(
      `${prePath}?input=${outputTokenId}&output=${inputTokenId}${
        ui === "pro" && !!swapProTab ? `&tab=${swapProTab}` : ""
      }`,
    );
    onSwitchTokens();
  }, [onSwitchTokens, inputTokenId, outputTokenId, swapProTab]);

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <SwapInputCurrency
          noLiquidity={noLiquidity}
          token={inputToken}
          currencyPrice={inputTokenPrice}
          formattedAmount={formattedAmounts[SWAP_FIELD.INPUT]}
          currencyBalance={inputToken ? currencyBalances[inputToken.address] : undefined}
          onMax={onMaxInput}
          onInput={(value: string) => onInput(value, "input")}
          onTokenChange={onTokenAChange}
          currencyState={inputTokenState}
          parsedAmount={parsedAmounts[SWAP_FIELD.INPUT]}
          background={ui === "pro" ? "level1" : "level3"}
          unusedBalance={inputTokenUnusedBalance}
          subBalance={inputTokenSubBalance}
          isInput
          maxInputAmount={maxInputAmount}
          poolId={poolId}
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
          onClick={handleSwitchTokens}
        >
          <Image
            src={ui === "pro" ? "/images/icon_exchange_pro.svg" : "/images/icon_exchange.svg"}
            sx={{ width: "28px", height: "28px" }}
          />
        </Box>
      </Box>

      <Box sx={{ marginTop: "6px" }}>
        <SwapInputCurrency
          token={outputToken}
          currencyPrice={outputTokenPrice}
          formattedAmount={formattedAmounts[SWAP_FIELD.OUTPUT]}
          currencyBalance={outputToken ? currencyBalances[outputToken.address] : undefined}
          onInput={(value: string) => onInput(value, "output")}
          onTokenChange={onTokenBChange}
          currencyState={outputTokenState}
          parsedAmount={parsedAmounts[SWAP_FIELD.OUTPUT]}
          usdChange={USDChange}
          background={ui === "pro" ? "level1" : "level3"}
          disabled
          unusedBalance={outputTokenUnusedBalance}
          subBalance={outputTokenSubBalance}
          poolId={poolId}
          noLiquidity={noLiquidity}
        />
      </Box>
    </Box>
  );
}
