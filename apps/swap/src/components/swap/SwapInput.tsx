import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { NumberTextField } from "components/index";
import { MAX_SWAP_INPUT_LENGTH, SAFE_DECIMALS_LENGTH } from "constants/index";
import type React from "react";
import { memo } from "react";

export interface SwapInputProps {
  value: string | number | Null;
  token: Token | Null;
  onUserInput: (value: string) => void;
  disabled?: boolean;
  align?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const SwapInput = memo(({ value, align = "right", token, onBlur, onUserInput, disabled }: SwapInputProps) => {
  const decimal = token?.decimals ?? SAFE_DECIMALS_LENGTH;

  return (
    <NumberTextField
      value={value ?? ""}
      fullWidth
      sx={{
        "& input": {
          textAlign: align,
          fontSize: "32px!important",
          fontWeight: 500,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: "var(--color-base-content)",
          padding: "0px",
          "@media(max-width: 640px)": { fontSize: "26px!important" },
        },
        "& input::placeholder": {
          fontSize: "32px",
          fontWeight: 500,
          color: "var(--color-neutral-content)",
          WebkitTextFillColor: "var(--color-neutral-content)",
          opacity: 0.65,
          "@media(max-width: 640px)": { fontSize: "26px" },
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
      onBlur={onBlur}
    />
  );
});
