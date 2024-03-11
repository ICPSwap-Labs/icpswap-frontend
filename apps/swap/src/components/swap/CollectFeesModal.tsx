import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwapModal from "components/modal/swap";
import CurrencyAvatar from "components/CurrencyAvatar";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { BigNumber } from "@icpswap/utils";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import Button from "components/authentication/ButtonConnector";
import { toFormat } from "utils/index";

const useStyles = makeStyles((theme: Theme) => ({
  feeBox: {
    padding: "16px 16px",
    borderRadius: "12px",
    background: theme.palette.background.level3,
  },
}));

export interface CollectFeeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  token0: Token | undefined;
  token1: Token | undefined;
  loading: boolean;
  currencyFeeAmount0: CurrencyAmount<Token> | undefined;
  currencyFeeAmount1: CurrencyAmount<Token> | undefined;
}

export default function CollectFeesModal({
  open,
  onClose,
  onConfirm,
  token0,
  token1,
  loading,
  currencyFeeAmount0,
  currencyFeeAmount1,
}: CollectFeeModalProps) {
  const classes = useStyles();

  return (
    <SwapModal open={open} onClose={onClose} title={t`Claim fees`}>
      <>
        <Box className={classes.feeBox}>
          <Grid container alignItems="center">
            <Grid item xs container alignItems="center">
              <Grid item mr={1}>
                <CurrencyAvatar currency={token0} />
              </Grid>
              <Grid item>
                <Typography color="text.primary">{token0?.symbol}</Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography align="right" color="text.primary">
                {currencyFeeAmount0 ? toFormat(new BigNumber(currencyFeeAmount0.toExact()).toFixed(8)) : "--"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container mt={2} alignItems="center">
            <Grid item xs container alignItems="center">
              <Grid item mr={1}>
                <CurrencyAvatar currency={token1} />
              </Grid>
              <Grid item>
                <Typography color="text.primary">{token1?.symbol}</Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography align="right" color="text.primary">
                {currencyFeeAmount1 ? toFormat(new BigNumber(currencyFeeAmount1.toExact()).toFixed(8)) : "--"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography mt={1}>
          <Trans>You can claim the liquidity incentive reward from the transaction according to your position.</Trans>
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ marginTop: "24px" }}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {loading ? "" : t`Claim`}
        </Button>
      </>
    </SwapModal>
  );
}
