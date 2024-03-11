import React from "react";
import { Grid, Box, Typography, Avatar } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { NumberTextField } from "components/index";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { Currency } from "@icpswap/swap-sdk";

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
        textAlign: "right",
        fontSize: "20px",
        fontWeight: 700,
        // color: theme.textPrimary,
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
      },
    },
  };
});

export interface DecreaseLiquidityInputProps {
  currency: Currency | undefined;
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
  const classes = useStyle();
  const theme = useTheme() as Theme;

  return (
    <Box className={classes.inputBox}>
      <Grid container>
        <Box className={classes.tokenButton}>
          <Grid item xs container alignItems="center">
            <Avatar
              sx={{
                ...theme.palette.avatar.bgcolor,
                display: "inline-block",
                marginRight: "8px",
                width: "24px",
                height: "24px",
              }}
              alt=""
              src={currency?.logo}
            >
              &nbsp;
            </Avatar>
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
              decimalScale: currency?.decimals ?? 8,
              allowNegative: false,
              maxLength: MAX_SWAP_INPUT_LENGTH,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onUserInput(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      <Box mt={1}>
        <Typography fontSize="12px">
          <Trans>Total Amount:</Trans> {totalAmount} {currency?.symbol}
        </Typography>
      </Box>
    </Box>
  );
}
