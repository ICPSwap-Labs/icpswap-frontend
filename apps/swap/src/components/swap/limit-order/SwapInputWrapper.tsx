import type { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Box } from "components/Mui";
import { SWAP_FIELD } from "constants/swap";
import type { UseCurrencyState } from "hooks/useCurrency";
import { useSwapState } from "store/swap/hooks";

import { SwapInputCurrency } from "../SwapInputCurrency";
import { SwapDirectionIcon } from "../SwapDirectionIcon";

export interface SwapInputWrapperProps {
  onInput: (value: string, type: "input" | "output") => void;
  onMaxInput: () => void;
  onTokenAChange: (token: Token) => void;
  onTokenBChange: (token: Token) => void;
  tokenAPrice: string | number | undefined;
  tokenBPrice: string | number | undefined;
  parsedAmounts: {
    INPUT: CurrencyAmount<Token> | undefined;
    OUTPUT: CurrencyAmount<Token> | undefined;
  };
  poolId: string | undefined;
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
  inputTokenSubBalance: string | Null;
  outputTokenSubBalance: string | Null;
  maxInputAmount: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
  onSwitchTokens: () => void;
  orderPrice: string | Null;
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
  poolId,
  onSwitchTokens,
}: SwapInputWrapperProps) {
  const { independentField, typedValue } = useSwapState();

  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6),
  };

  return (
    <Box className={`swap-asset-grid ${ui === "normal" ? "swap-asset-grid-wide" : ""}`}>
      <Box className="swap-asset-input">
        <SwapInputCurrency
          noLiquidity={noLiquidity}
          token={inputToken}
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
          maxInputAmount={maxInputAmount}
          poolId={poolId}
        />
      </Box>

      <Box component="button" type="button" className="btn btn-square swap-direction-control" onClick={onSwitchTokens}>
        <SwapDirectionIcon />
      </Box>

      <Box className="swap-asset-output">
        <SwapInputCurrency
          token={outputToken}
          currencyPrice={tokenBPrice}
          formattedAmount={formattedAmounts[SWAP_FIELD.OUTPUT]}
          currencyBalance={currencyBalances[SWAP_FIELD.OUTPUT]}
          onInput={(value: string) => onInput(value, "output")}
          onTokenChange={onTokenBChange}
          currencyState={outputCurrencyState}
          parsedAmount={parsedAmounts[SWAP_FIELD.OUTPUT]}
          background={ui === "pro" ? "level1" : "level3"}
          unusedBalance={outputTokenUnusedBalance}
          subBalance={outputTokenSubBalance}
          poolId={poolId}
          noLiquidity={noLiquidity}
        />
      </Box>
    </Box>
  );
}
