import React, { memo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { MAX_SWAP_INPUT_LENGTH, SAFE_DECIMALS_LENGTH } from "constants/index";
import { NumberTextField } from "components/index";

export interface SwapInputProps {
  value: string | number | undefined;
  token: Token | undefined;
  onUserInput: (value: string) => void;
  disabled?: boolean;
}

export const SwapInput = memo(({ value, token, onUserInput, disabled }: SwapInputProps) => {
  const decimal = token?.decimals ?? SAFE_DECIMALS_LENGTH;

  return (
    <NumberTextField
      value={value}
      fullWidth
      sx={{
        "& input": {
          textAlign: "right",
          fontSize: "28px!important",
          fontWeight: 600,
          padding: "0px",
        },
        "& input::placeholder": {
          fontSize: "28px",
          fontWeight: 600,
        },
      }}
      placeholder="0.0"
      variant="standard"
      disabled={disabled}
      numericProps={{
        thousandSeparator: true,
        decimalScale: decimal > SAFE_DECIMALS_LENGTH ? SAFE_DECIMALS_LENGTH : decimal,
        allowNegative: false,
        maxLength: MAX_SWAP_INPUT_LENGTH,
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUserInput(e.target.value)}
    />
  );
});
