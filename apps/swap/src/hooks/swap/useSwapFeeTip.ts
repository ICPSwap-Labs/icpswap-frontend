import { useMemo } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { TradeType } from "@icpswap/constants";
import { Token, Trade } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/useUSDPrice";

export function useSwapFeeTip(trade: Trade<Token, Token, TradeType> | null) {
  const inputToken = trade?.inputAmount.currency;
  const outputToken = trade?.outputAmount.currency;

  const inputTokenUSDPrice = useUSDPriceById(inputToken?.wrapped.address);
  const outputTokenUSDPrice = useUSDPriceById(outputToken?.wrapped.address);

  const inputTokenFee = useMemo(() => {
    if (!inputToken) return undefined;
    return parseTokenAmount(inputToken?.transFee, inputToken?.decimals).multipliedBy(2);
  }, [inputToken]);

  const outputTokenFee = useMemo(() => {
    if (!outputToken) return undefined;
    return parseTokenAmount(outputToken.transFee, outputToken.decimals);
  }, [outputToken]);

  const inputFeeUSDValue = useMemo(() => {
    if (!inputTokenFee || !inputTokenUSDPrice) return undefined;
    return inputTokenFee.multipliedBy(inputTokenUSDPrice).toFixed(4);
  }, [inputTokenFee, inputTokenUSDPrice]);

  const outputFeeUSDValue = useMemo(() => {
    if (!outputTokenFee || !outputTokenUSDPrice) return undefined;
    return outputTokenFee.multipliedBy(outputTokenUSDPrice).toFixed(4);
  }, [outputTokenFee, outputTokenUSDPrice]);

  return useMemo(
    () => ({ inputTokenFee, inputFeeUSDValue, outputTokenFee, outputFeeUSDValue }),
    [inputTokenFee, inputFeeUSDValue, outputTokenFee, outputFeeUSDValue],
  );
}
