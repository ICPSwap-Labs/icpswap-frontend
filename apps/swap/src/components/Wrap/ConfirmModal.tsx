import SwapModal from "components/modal/swap";
import { Typography, Box, Grid, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ArrowRightAlt } from "@mui/icons-material";
import CurrencyAvatar from "components/CurrencyAvatar";
import { t } from "@lingui/macro";
import { SWAP_FIELD } from "constants/swap";
import { Currency } from "@icpswap/swap-sdk";
import { Theme } from "@mui/material/styles";

const useStyle = makeStyles((theme: Theme) => {
  return {
    transferBox: {
      borderRadius: "12px",
      background: theme.palette.background.level3,
      padding: "20px 24px",
      [theme.breakpoints.down("sm")]: {
        padding: "9px 14px",
      },
    },
    arrowDown: {
      transform: "rotate(90deg)",
    },
  };
});

const SwapCurrency = ({
  currency,
  currencyAmount,
}: {
  currency: Currency | undefined | null;
  currencyAmount: number | string;
}) => {
  return (
    <Grid container alignItems="center">
      <Box>
        <Grid container alignItems="center">
          <Grid sx={{ mr: 1 }}>
            <CurrencyAvatar currency={currency} bgColor="#497BF7" borderColor="transparent" />
          </Grid>
          <Grid item>
            <Typography color="textPrimary">{currency?.symbol}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs>
        <Typography color="textPrimary" align="right">
          {currencyAmount}
        </Typography>
      </Grid>
    </Grid>
  );
};

export interface ConfirmModalProps {
  open: boolean;
  loading: boolean;
  inputCurrency: Currency | undefined | null;
  outputCurrency: Currency | undefined | null;
  formattedAmounts: {
    [SWAP_FIELD.INPUT]: number | string;
    [SWAP_FIELD.OUTPUT]: number | string;
  };
  isWrap?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  open,
  loading,
  inputCurrency,
  outputCurrency,
  formattedAmounts,
  isWrap,
  onConfirm = () => {},
  onClose = () => {},
}: ConfirmModalProps) {
  const classes = useStyle();

  return (
    <SwapModal open={open} title={isWrap ? t`Confirm Wrap` : t`Confirm Unwrap`} onClose={onClose}>
      <Box>
        <Box className={classes.transferBox}>
          <SwapCurrency currency={inputCurrency} currencyAmount={formattedAmounts?.[SWAP_FIELD.INPUT]} />
          <Grid container alignItems="center">
            <ArrowRightAlt className={classes.arrowDown} sx={{ color: "#C4C4C4" }} />
          </Grid>
          <SwapCurrency currency={outputCurrency} currencyAmount={formattedAmounts?.[SWAP_FIELD.OUTPUT]} />
        </Box>
      </Box>
      <Grid mt={4}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {loading ? "" : isWrap ? t`Confirm Wrap` : t`Confirm Unwrap`}
        </Button>
      </Grid>
    </SwapModal>
  );
}
