import { ReactNode, useMemo } from "react";
import { Typography, Box, Button, CircularProgress, useMediaQuery, makeStyles, useTheme, Theme } from "components/Mui";
import { computeRealizedLPFeePercent } from "utils/swap/prices";
import { TradePrice } from "components/swap/TradePrice";
import { BigNumber, formatDollarAmount, formatTokenAmount, numberToString, parseTokenAmount } from "@icpswap/utils";
import { Token, CurrencyAmount, Trade, Percent } from "@icpswap/swap-sdk";
import { TradeType } from "@icpswap/constants";
import { isElement } from "react-is";
import { useSwapTokenFeeCost } from "hooks/swap/index";
import { Flex, TokenImage, Tooltip } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useTranslation } from "react-i18next";
import FormattedPriceImpact from "components/swap/FormattedPriceImpact";
import { feeAmountPercent } from "utils/swap/feeAmountPercent";
import colors from "theme/colors";
import { Modal } from "@icpswap/ui";

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
  value: ReactNode;
  tooltip?: ReactNode;
  valueColor?: string;
}

export function DetailItem({ label, value, tooltip, valueColor = "text.primary" }: DetailItemProps) {
  const theme = useTheme();
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

      <Flex justify="flex-end" align="flex-start">
        {isElement(value) ? (
          value
        ) : (
          <Typography
            color={valueColor}
            align="right"
            sx={{
              ...(matchDownSM ? { fontSize: "12px" } : {}),
            }}
          >
            {value}
          </Typography>
        )}
      </Flex>
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
  inputTokenSubBalance: BigNumber | undefined;
  inputTokenUnusedBalance: bigint | undefined;
  inputTokenBalance: BigNumber | undefined;
}

export function SwapConfirmModal({
  slippageTolerance,
  open,
  trade,
  loading,
  onConfirm,
  onClose,
  inputTokenBalance,
  inputTokenUnusedBalance,
  inputTokenSubBalance,
}: SwapConfirmModalProps) {
  const { t } = useTranslation();
  const classes = useStyle();

  const { realizedLPFee, priceImpact, inputToken, outputToken, inputAmount, pool } = useMemo(() => {
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
      inputToken: trade.inputAmount.currency,
      outputToken: trade.outputAmount.currency,
      inputAmount: trade.inputAmount.toExact(),
      pool: trade.swaps[0].route.pools[0],
    };
  }, [trade]);

  const inputTokenPrice = useUSDPriceById(inputToken?.address);
  const outputTokenPrice = useUSDPriceById(outputToken?.address);

  const swapTokenFee = useSwapTokenFeeCost({
    token: inputToken,
    subAccountBalance: inputTokenSubBalance,
    tokenBalance: inputTokenBalance,
    unusedBalance: inputTokenUnusedBalance,
    amount: formatTokenAmount(inputAmount, inputToken?.decimals).toString(),
  });

  return (
    <Modal open={open} title={t("swap.confirm")} onClose={onClose} background="level1">
      <>
        <Box className={classes.box}>
          <Box className={classes.wrapper}>
            <Flex gap="0 12px">
              <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="40px" />
              <Flex gap="8px 0" vertical align="flex-start">
                <Flex gap="0 4px">
                  <Typography>{t("common.you.pay")}</Typography>
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
              <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="40px" />
              <Flex gap="8px 0" vertical align="flex-start">
                <Typography>{t("common.you.receive")}</Typography>
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
                token0={inputToken}
                token1={outputToken}
                token0PriceUSDValue={inputTokenPrice}
                token1PriceUSDValue={outputTokenPrice}
                noInfo
              />
            }
          />
          <DetailItem
            label={t("swap.liquidity.provider.fee", { value: pool ? feeAmountPercent(pool.fee) : "--" })}
            value={realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.currency.symbol}` : "-"}
            tooltip={<Tooltip background="#ffffff" tips={t("swap.liquidity.provider.fee.tips")} />}
          />
          <DetailItem
            label={t("swap.price.impact")}
            value={FormattedPriceImpact({ priceImpact })}
            tooltip={
              <Tooltip
                background="#ffffff"
                tips={t`The difference between the market price and your price due to trade size.`}
              />
            }
          />
          <DetailItem
            label={t("swap.slippage.tolerance")}
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
            label={t("swap.minimum.received")}
            value={`${slippageTolerance ? trade?.minimumAmountOut(slippageTolerance).toSignificant(6) : "--"} ${trade
              ?.outputAmount.currency.symbol}`}
            tooltip={
              <Tooltip
                background="#ffffff"
                tips="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              />
            }
            valueColor={colors.warningDark}
          />
          <DetailItem
            label={t("swap.estimated.fee")}
            value={
              <Box>
                <Typography
                  color="text.primary"
                  sx={{ textAlign: "right", "@media(max-width: 640px)": { fontSize: "12px" } }}
                >
                  {swapTokenFee && inputToken && inputTokenPrice
                    ? `${parseTokenAmount(swapTokenFee, inputToken.decimals).toFormat()} ${
                        inputToken.symbol
                      } (${formatDollarAmount(
                        parseTokenAmount(swapTokenFee, inputToken.decimals).multipliedBy(inputTokenPrice).toString(),
                      )})`
                    : "--"}
                </Typography>
                <Typography
                  color="text.primary"
                  sx={{ textAlign: "right", margin: "5px 0 0 0", "@media(max-width: 640px)": { fontSize: "12px" } }}
                >
                  {outputToken && outputTokenPrice
                    ? `${parseTokenAmount(outputToken.transFee, outputToken.decimals).toFormat()} ${
                        outputToken.symbol
                      } (${formatDollarAmount(
                        parseTokenAmount(outputToken.transFee, outputToken.decimals)
                          .multipliedBy(outputTokenPrice)
                          .toString(),
                      )})`
                    : "--"}
                </Typography>
              </Box>
            }
            tooltip={<Tooltip background="#ffffff" tips={t`Swapping a too small amount might lead to failure!`} />}
          />
          <DetailItem label={t("swap.gas.fee")} value="0 (forever)" />
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
            {loading ? "" : t("swap.confirm")}
          </Button>
        </Box>
      </>
    </Modal>
  );
}
