import { memo } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import SwapModal from "components/modal/swap";
import { BURN_FIELD } from "constants/swap";
import { Trans } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";

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
    currencyA: Token | undefined;
    currencyB: Token | undefined;
    formattedAmounts: { [key in BURN_FIELD]?: string };
  }) => {
    return (
      <SwapModal open={open} onClose={onCancel} title="Remove Liquidity">
        <>
          <Box mt={1}>
            <Grid container mt={1} alignItems="center">
              <Grid item xs container alignItems="center">
                <Grid item mr={1}>
                  <TokenImage tokenId={currencyA?.wrapped.address} logo={currencyA?.wrapped.logo} />
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
                  <TokenImage tokenId={currencyB?.wrapped.address} logo={currencyB?.wrapped.logo} />
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
