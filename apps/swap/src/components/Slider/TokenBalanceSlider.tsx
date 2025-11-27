import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useCallback } from "react";
import { Slider } from "components/Slider/Slider";

export interface BalanceSliderProps {
  totalAmount: string | Null;
  token: Token | Null;
  onAmountChange: (amount: string) => void;
  width?: string | number;
  trackColor?: string;
  value: string | Null;
}

export const TokenBalanceSlider = ({
  token,
  totalAmount,
  onAmountChange,
  width,
  trackColor,
  value,
}: BalanceSliderProps) => {
  const handleAmountChange = useCallback(
    (amount: string) => {
      if (isUndefinedOrNull(token)) return;

      // Do not allow more decimal places if the amount is an integer
      if (new BigNumber(amount).isInteger()) {
        onAmountChange(new BigNumber(amount).toFixed(0));
      } else {
        onAmountChange(new BigNumber(amount).toFixed(token.decimals));
      }
    },
    [onAmountChange, token],
  );

  return (
    <Slider
      value={value}
      onAmountChange={handleAmountChange}
      totalAmount={totalAmount}
      width={width}
      trackColor={trackColor}
    />
  );
};
