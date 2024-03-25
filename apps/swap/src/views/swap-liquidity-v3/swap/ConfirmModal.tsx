import { useMemo } from "react";
import SwapModal from "components/modal/swap";
import { Typography, Box, Grid, Button, CircularProgress, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { ArrowRightAlt } from "@mui/icons-material";
import CurrencyAvatar from "components/CurrencyAvatar";
import { computeRealizedLPFeePercent } from "utils/swap/prices";
import { TradePriceNoInfo as TradePrice } from "components/swap/TradePrice";
import Tooltip from "components/Tooltip";
import { numberToString } from "@icpswap/utils";
import { Currency, CurrencyAmount, Trade, Percent } from "@icpswap/swap-sdk";
import { TradeType } from "@icpswap/constants";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { isElement } from "react-is";
import { useSwapFeeTip } from "hooks/swap/useSwapFeeTip";
import FormattedPriceImpact from "./FormattedPriceImpact";

const useStyle = makeStyles((theme: Theme) => {
  return {
    transferBox: {
      borderRadius: "12px",
      background: theme.palette.background.level3,
      padding: "10px 12px",
    },
    arrowDown: {
      transform: "rotate(90deg)",
    },
  };
});

export interface SwapCurrencyProps {
  currency: Currency | undefined;
  currencyAmount: CurrencyAmount<Currency> | undefined;
  inputCurrency?: boolean;
}

export function SwapCurrency({ currency, currencyAmount, inputCurrency }: SwapCurrencyProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

      <Box sx={{ display: "flex", gap: "0 3px", alignItems: "center" }}>
        <Typography color="textPrimary" align="right">
          {currencyAmount?.toSignificant(6, { groupSeparator: "," })}
        </Typography>

        {inputCurrency ? (
          <Tooltip background="#ffffff" tips={t`Actual swap amount after deducting transfer fees`} />
        ) : null}
      </Box>
    </Box>
  );
}

export interface DetailItemProps {
  label: string;
  value: React.ReactChild;
  tooltip?: React.ReactChild;
}

export function DetailItem({ label, value, tooltip }: DetailItemProps) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            lineHeight: "12px",
            "@media(max-width: 640px)": { fontSize: "12px" },
          }}
          component="div"
        >
          {label}
          {tooltip ? (
            <Box
              sx={{ display: "inline-block", cursor: "pointer", position: "relative", top: "4px", margin: "0 0 0 5px" }}
            >
              {tooltip}
            </Box>
          ) : null}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {isElement(value) ? (
          value
        ) : (
          <Typography
            color="textPrimary"
            align="right"
            sx={{
              ...(matchDownSM ? { fontSize: "12px" } : {}),
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export interface SwapConfirmModalProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  slippageTolerance: Percent | null;
  trade: Trade<Currency, Currency, TradeType> | null;
}

export default ({ slippageTolerance, open, trade, loading, onConfirm, onClose }: SwapConfirmModalProps) => {
  const classes = useStyle();

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined };

    const feeAmount = CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      numberToString(trade.inputAmount.currency.transFee),
    );

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    // sub transferFee
    const realizedLPFee = trade.inputAmount.subtract(feeAmount).multiply(realizedLpFeePercent);
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);
    return { priceImpact, realizedLPFee };
  }, [trade]);

  const { inputFeeUSDValue, inputTokenFee, outputFeeUSDValue, outputTokenFee } = useSwapFeeTip(trade);

  return (
    <SwapModal open={open} title={t`Confirm Swap`} onClose={onClose}>
      <>
        <Box>
          <Box className={classes.transferBox}>
            <SwapCurrency currency={trade?.inputAmount?.currency} currencyAmount={trade?.inputAmount} inputCurrency />
            <Grid container alignItems="center">
              <ArrowRightAlt className={classes.arrowDown} sx={{ color: "#C4C4C4" }} />
            </Grid>
            <SwapCurrency currency={trade?.outputAmount?.currency} currencyAmount={trade?.outputAmount} />
          </Box>
          {/* <Grid mt={1} container justifyContent="center">
          <Typography fontSize={12}>
            Output is estimated. You will receive at least{" "}
            <Typography component="span" color="textPrimary" fontSize="12px">
              {trade?.minimumAmountOut(slippageTolerance).toSignificant(6)}{" "}
              {trade?.outputAmount.currency.symbol}
            </Typography>{" "}
            or the transaction will revert.
          </Typography>
        </Grid> */}
        </Box>

        <Box mt={2} sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
          <DetailItem label={t`Price`} value={<TradePrice price={trade?.executionPrice} />} />
          <DetailItem
            label={t`Liquidity Provider Fee`}
            value={realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.currency.symbol}` : "-"}
            tooltip={<Tooltip background="#ffffff" tips={t`For each trade a 0.3% fee is paid.`} />}
          />
          <DetailItem
            label={t`Price Impact`}
            value={FormattedPriceImpact({ priceImpact })}
            tooltip={
              <Tooltip
                background="#ffffff"
                tips={t`The difference between the market price and your price due to trade size.`}
              />
            }
          />
          <DetailItem
            label={t`Slippage tolerance`}
            value={`${slippageTolerance?.toFixed(2)}%`}
            tooltip={
              <Tooltip
                background="#ffffff"
                tips={t`Your transaction will revert if the price changes unfavorably
              by more than this percentage.`}
              />
            }
          />
          <DetailItem
            label="Minimum received"
            value={`${slippageTolerance ? trade?.minimumAmountOut(slippageTolerance).toSignificant(6) : "--"} ${trade
              ?.outputAmount.currency.symbol}`}
            tooltip={
              <Tooltip
                background="#ffffff"
                tips="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              />
            }
          />
          <DetailItem
            label={t`Estimated transfer fee for the swap`}
            value={
              <Box>
                <Typography color="text.primary" sx={{ "@media(max-width: 640px)": { fontSize: "12px" } }}>
                  {inputTokenFee && inputFeeUSDValue && trade?.inputAmount.currency
                    ? `${inputTokenFee.toFormat()} ${trade.inputAmount.currency.symbol} ($${inputFeeUSDValue})`
                    : "--"}
                </Typography>
                <Typography
                  color="text.primary"
                  sx={{ margin: "5px 0 0 0", "@media(max-width: 640px)": { fontSize: "12px" } }}
                >
                  {outputTokenFee && trade?.outputAmount.currency
                    ? `${outputTokenFee.toFormat()} ${trade.outputAmount.currency.symbol} ($${
                        outputFeeUSDValue ?? "--"
                      })`
                    : "--"}
                </Typography>
              </Box>
            }
            tooltip={<Tooltip background="#ffffff" tips={t`Swapping a too small amount might lead to failure!`} />}
          />
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {loading ? "" : t`Confirm Swap`}
          </Button>
        </Box>
      </>
    </SwapModal>
  );
};
