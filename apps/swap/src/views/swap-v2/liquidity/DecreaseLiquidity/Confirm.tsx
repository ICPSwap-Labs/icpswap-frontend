import { memo } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import SwapModal from "components/modal/swap";
import CurrencyAvatar from "components/CurrencyAvatar";
import { BURN_FIELD } from "constants/swap";
import { Trans } from "@lingui/macro";
import { Currency } from "@icpswap/swap-sdk";

export default memo(
  ({
    open,
    onCancel,
    onConfirm,
    formattedAmounts,
    currencyA,
    currencyB,
  }: {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    formattedAmounts: { [key in BURN_FIELD]?: string };
  }) => {
    return (
      <SwapModal open={open} onClose={onCancel} title="Remove Liquidity">
        <>
          <Box mt={1}>
            <Grid container mt={1} alignItems="center">
              <Grid item xs container alignItems="center">
                <Grid item mr={1}>
                  <CurrencyAvatar currency={currencyA} />
                </Grid>
                <Grid item>
                  <Typography>{currencyA?.symbol}</Typography>
                </Grid>
              </Grid>
              <Grid item xs>
                <Typography align="right">{formattedAmounts[BURN_FIELD.CURRENCY_A] ?? 0}</Typography>
              </Grid>
            </Grid>
            <Grid container mt={2} alignItems="center">
              <Grid item xs container alignItems="center">
                <Grid item mr={1}>
                  <CurrencyAvatar currency={currencyB} />
                </Grid>
                <Grid item>
                  <Typography>{currencyB?.symbol}</Typography>
                </Grid>
              </Grid>
              <Grid item xs>
                <Typography align="right">{formattedAmounts[BURN_FIELD.CURRENCY_B] ?? 0}</Typography>
              </Grid>
            </Grid>
          </Box>
          <Button variant="contained" size="large" fullWidth sx={{ marginTop: "40px" }} onClick={onConfirm}>
            <Trans>Remove</Trans>
          </Button>
        </>
      </SwapModal>
    );
  },
);
