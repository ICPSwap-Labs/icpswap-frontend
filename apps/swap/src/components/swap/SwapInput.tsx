import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import { Currency } from "@icpswap/swap-sdk";
import { MAX_SWAP_INPUT_LENGTH, SAFE_DECIMALS_LENGTH } from "constants/index";
import { NumberTextField } from "components/index";

const useStyles = makeStyles(() => {
  return {
    input: {
      "& input": {
        textAlign: "right",
        fontSize: "20px",
        fontWeight: 700,
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
      },
    },
    switchIcon: {
      cursor: "pointer",
    },
  };
});

export interface SwapInputProps {
  value: string | number;
  currency: Currency | undefined;
  onUserInput: (value: string) => void;
  disabled?: boolean;
}

export const SwapInput = memo(({ value, currency, onUserInput, disabled }: SwapInputProps) => {
  const classes = useStyles();

  const decimal = currency?.decimals ?? SAFE_DECIMALS_LENGTH;

  return (
    <NumberTextField
      value={value}
      fullWidth
      className={classes.input}
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
