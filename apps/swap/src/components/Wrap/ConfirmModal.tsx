import { Typography, Box, Grid, Button, CircularProgress, makeStyles, Theme } from "components/Mui";
import { ArrowRightAlt } from "@mui/icons-material";
import { SWAP_FIELD } from "constants/swap";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
import { useTranslation } from "react-i18next";
import { Flex, Modal } from "@icpswap/ui";

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

interface SwapCurrencyProps {
  currency: Token | undefined | null;
  currencyAmount: number | string;
}

const SwapCurrency = ({ currency, currencyAmount }: SwapCurrencyProps) => {
  return (
    <Grid container alignItems="center">
      <Box>
        <Grid container alignItems="center">
          <Grid sx={{ mr: 1 }}>
            <TokenImage tokenId={currency?.wrapped.address} logo={currency?.wrapped.logo} />
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
  inputCurrency: Token | undefined | null;
  outputCurrency: Token | undefined | null;
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
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const classes = useStyle();

  return (
    <Modal open={open} title={isWrap ? t("wrap.confirm") : t("unwrap.confirm")} onClose={onClose} background="level1">
      <Box>
        <Box className={classes.transferBox}>
          <SwapCurrency currency={inputCurrency} currencyAmount={formattedAmounts?.[SWAP_FIELD.INPUT]} />
          <Flex fullWidth>
            <ArrowRightAlt className={classes.arrowDown} sx={{ color: "#C4C4C4" }} />
          </Flex>
          <SwapCurrency currency={outputCurrency} currencyAmount={formattedAmounts?.[SWAP_FIELD.OUTPUT]} />
        </Box>
      </Box>

      <Button
        mt={4}
        variant="contained"
        size="large"
        fullWidth
        onClick={onConfirm}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
      >
        {loading ? "" : isWrap ? t("wrap.confirm") : t("unwrap.confirm")}
      </Button>
    </Modal>
  );
}
