import { useMemo } from "react";
import SwapModal from "components/modal/swap";
import { Typography, Box, Button, CircularProgress, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { computeRealizedLPFeePercent } from "utils/swap/prices";
import { TradePriceNoInfo as TradePrice } from "components/swap/TradePrice";
import Tooltip from "components/Tooltip";
import { numberToString } from "@icpswap/utils";
import { Token, CurrencyAmount, Trade, Percent } from "@icpswap/swap-sdk";
import { TradeType } from "@icpswap/constants";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { isElement } from "react-is";
import { useSwapFeeTip } from "hooks/swap/useSwapFeeTip";
import { Flex, TokenImage } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";

import FormattedPriceImpact from "./FormattedPriceImpact";

const useStyle = makeStyles((theme: Theme) => {
  return {
    box: {
      borderRadius: "12px",
      background: theme.palette.background.level3,
      border: `1px solid ${theme.palette.background.level4}`,
    },
    wrapper: {
      padding: "16px 24px",
    },
    line: {
      width: "100%",
      height: "1px",
      background: theme.palette.background.level4,
    },
  };
});

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
  trade: Trade<Token, Token, TradeType> | null;
}

export default ({ slippageTolerance, open, trade, loading, onConfirm, onClose }: SwapConfirmModalProps) => {
  const classes = useStyle();

  const { realizedLPFee, priceImpact, inputCurrency, outputCurrency } = useMemo(() => {
    if (!trade) return {};

    const feeAmount = CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      numberToString(trade.inputAmount.currency.transFee),
    );

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    // sub transferFee
    const realizedLPFee = trade.inputAmount.subtract(feeAmount).multiply(realizedLpFeePercent);
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);

    return {
      priceImpact,
      realizedLPFee,
      inputCurrency: trade.inputAmount.currency,
      outputCurrency: trade.outputAmount.currency,
    };
  }, [trade]);

  const { inputFeeUSDValue, inputTokenFee, outputFeeUSDValue, outputTokenFee } = useSwapFeeTip(trade);

  const token0Price = useUSDPriceById(inputCurrency?.address);
  const token1Price = useUSDPriceById(outputCurrency?.address);

  return (
    <SwapModal open={open} title={t`Confirm Swap`} onClose={onClose}>
      <>
        <Box className={classes.box}>
          <Box className={classes.wrapper}>
            <Flex gap="0 12px">
              <TokenImage tokenId={inputCurrency?.address} logo={inputCurrency?.logo} size="40px" />
              <Flex gap="8px 0" vertical align="flex-start">
                <Flex gap="0 4px">
                  <Typography>You pay</Typography>
                  <Tooltip background="#ffffff" tips={t`Actual swap amount after deducting transfer fees`} />
                </Flex>

                <Typography sx={{ fontSize: "20px", color: "text.primary", fontWeight: 600 }}>
                  {trade
                    ? `${trade.inputAmount.toSignificant(6, { groupSeparator: "," })} ${
                        trade.inputAmount.currency.symbol
                      }`
                    : "--"}
                </Typography>
              </Flex>
            </Flex>
          </Box>

          <Box className={classes.line} />

          <Box className={classes.wrapper}>
            <Flex gap="0 12px">
              <TokenImage tokenId={outputCurrency?.address} logo={outputCurrency?.logo} size="40px" />
              <Flex gap="8px 0" vertical align="flex-start">
                <Typography>You Receive</Typography>
                <Typography sx={{ fontSize: "20px", color: "text.primary", fontWeight: 600 }}>
                  {trade
                    ? `${trade.outputAmount.toSignificant(6, { groupSeparator: "," })} ${
                        trade.outputAmount.currency.symbol
                      }`
                    : "--"}
                </Typography>
              </Flex>
            </Flex>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0", margin: "24px 0 0 0" }}>
          <DetailItem
            label={t`Price`}
            value={
              <TradePrice
                price={trade?.executionPrice}
                showConvert={false}
                color="text.primary"
                token0={inputCurrency}
                token1={outputCurrency}
                token0PriceUSDValue={token0Price}
                token1PriceUSDValue={token1Price}
              />
            }
          />
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
                <Typography
                  color="text.primary"
                  sx={{ textAlign: "right", "@media(max-width: 640px)": { fontSize: "12px" } }}
                >
                  {inputTokenFee && inputFeeUSDValue && trade?.inputAmount.currency
                    ? `${inputTokenFee.toFormat()} ${trade.inputAmount.currency.symbol} ($${inputFeeUSDValue})`
                    : "--"}
                </Typography>
                <Typography
                  color="text.primary"
                  sx={{ textAlign: "right", margin: "5px 0 0 0", "@media(max-width: 640px)": { fontSize: "12px" } }}
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

        <Box sx={{ margin: "24px 0 0 0" }}>
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
