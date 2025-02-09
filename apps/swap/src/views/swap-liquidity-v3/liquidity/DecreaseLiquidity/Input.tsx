import React from "react";
import { Grid, Box, Typography, makeStyles, Theme } from "components/Mui";
import { NumberTextField, TokenImage } from "components/index";
import { MAX_SWAP_INPUT_LENGTH, SAFE_DECIMALS_LENGTH } from "constants/index";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme: Theme) => {
  return {
    inputBox: {
      backgroundColor: theme.palette.background.level3,
      borderRadius: "12px",
      padding: "16px 24px 16px 12px",
    },
    tokenButton: {
      backgroundColor: theme.palette.background.level2,
      borderRadius: "12px",
      padding: "9px 28px 9px 12px",
    },
    input: {
      "& input": {
        "&.MuiInputBase-input": {
          textAlign: "right",
          fontSize: "20px",
          fontWeight: 700,
        },
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
      },
    },
  };
});

export interface DecreaseLiquidityInputProps {
  currency: Token | undefined;
  value: string | number;
  onUserInput: (value: string) => void;
  totalAmount: React.ReactChild;
}

export default function DecreaseLiquidityInput({
  currency,
  value,
  onUserInput,
  totalAmount,
}: DecreaseLiquidityInputProps) {
  const { t } = useTranslation();
  const classes = useStyle();

  const decimals = currency?.decimals ?? SAFE_DECIMALS_LENGTH;

  return (
    <Box className={classes.inputBox}>
      <Grid container>
        <Box className={classes.tokenButton}>
          <Grid item xs container alignItems="center" gap="0 8px">
            <TokenImage logo={currency?.logo} tokenId={currency?.wrapped.address} size="24px" />
            <Typography component="span">{currency?.symbol}</Typography>
          </Grid>
        </Box>
        <Grid item xs>
          <NumberTextField
            fullWidth
            value={value}
            className={classes.input}
            placeholder="0.0"
            variant="standard"
            numericProps={{
              thousandSeparator: true,
              decimalScale: decimals > SAFE_DECIMALS_LENGTH ? SAFE_DECIMALS_LENGTH : decimals,
              allowNegative: false,
              maxLength: MAX_SWAP_INPUT_LENGTH,
            }}
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onUserInput(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      <Box mt={1}>
        <Typography fontSize="12px">
          {t("common.total.amount", { amount: `${totalAmount} ${currency?.symbol}` })}
        </Typography>
      </Box>
    </Box>
  );
}
