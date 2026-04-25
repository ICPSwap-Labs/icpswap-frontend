import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Modal } from "@icpswap/ui";
import {
  BigNumber,
  formatDollarAmount,
  formatTokenAmount,
  isUndefinedOrNull,
  parseTokenAmount,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { Flex, TokenImage, Tooltip } from "components/index";
import { Box, Button, makeStyles, type Theme, Typography, useTheme } from "components/Mui";
import { TradePriceV2 as TradePrice } from "components/swap/TradePrice";
import { useSwapTokenFeeCost } from "hooks/swap/index";
import { useMediaQuerySM } from "hooks/theme";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { isElement } from "react-is";

const useStyle = makeStyles((theme: Theme) => {
  return {
    box: {
      borderRadius: "12px",
      background: theme.palette.background.level3,
      border: `1px solid ${theme.palette.background.level4}`,
    },
    wrapper: {
      padding: "20px 24px",
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
}

export function DetailItem({ label, value, tooltip }: DetailItemProps) {
  const matchDownSM = useMediaQuerySM();

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <Flex sx={{ flex: 1, overflow: "hidden" }} align="flex-start">
        <Typography
          sx={{
            lineHeight: "12px",
            "@media(max-width: 640px)": { fontSize: "12px" },
          }}
          component="div"
        >
          {label}
          {tooltip ? (
            <Box sx={{ display: "inline-block", cursor: "pointer", margin: "0 0 0 4px", verticalAlign: "top" }}>
              {tooltip}
            </Box>
          ) : null}
        </Typography>
      </Flex>

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        {isElement(value) ? (
          value
        ) : (
          <Typography
            color="textPrimary"
            align="right"
            sx={{
              ...(matchDownSM ? { fontSize: "12px" } : {}),
            }}
            component="div"
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export interface LimitOrderConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  inputTokenSubBalance: string | undefined;
  inputTokenUnusedBalance: bigint | undefined;
  inputTokenBalance: string | undefined;
  orderPrice: string | Null;
  currentPrice: string | Null;
  inputToken: Token | Null;
  outputToken: Token | Null;
  inputAmount: string;
}

export function LimitOrderConfirm({
  open,
  onConfirm,
  onClose,
  inputTokenBalance,
  inputTokenUnusedBalance,
  inputTokenSubBalance,
  orderPrice,
  currentPrice,
  inputToken,
  outputToken,
  inputAmount,
}: LimitOrderConfirmProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyle();

  const [viewAll, setViewAll] = useState(false);

  const outputAmount = useMemo(() => {
    if (isUndefinedOrNull(orderPrice) || isUndefinedOrNull(inputAmount)) return undefined;

    return new BigNumber(inputAmount).multipliedBy(orderPrice).toString();
  }, [inputAmount, orderPrice]);

  const inputTokenPrice = useUSDPriceById(inputToken?.address);

  const swapFeeCost = useSwapTokenFeeCost({
    token: inputToken,
    subAccountBalance: inputTokenSubBalance,
    tokenBalance: inputTokenBalance,
    unusedBalance: inputTokenUnusedBalance,
    amount: formatTokenAmount(inputAmount, inputToken?.decimals).toString(),
  });

  const handleViewAll = useCallback((viewAll: boolean) => {
    setViewAll(viewAll);
  }, []);

  return (
    <Modal open={open} title={t("limit.submit")} onClose={onClose} background="level1">
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
                {inputToken && inputAmount
                  ? `${toSignificantWithGroupSeparator(inputAmount)} ${inputToken.symbol}`
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
                {outputAmount && outputToken
                  ? `${toSignificantWithGroupSeparator(outputAmount)} ${outputToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px 0", margin: "24px 0 0 0" }}>
        <DetailItem
          label={t("common.limit.price")}
          value={
            <TradePrice
              price={orderPrice}
              showConvert={false}
              color="text.primary"
              token0={inputToken}
              token1={outputToken}
            />
          }
          tooltip={<Tooltip background="#ffffff" tips={t("common.limit.price.tips")} iconSize="14px" />}
        />

        <DetailItem
          label={t("common.current.price")}
          value={
            <TradePrice
              price={currentPrice}
              showConvert={false}
              color="text.primary"
              token0={inputToken}
              token1={outputToken}
            />
          }
        />

        <DetailItem
          label={t("limit.estimated.earning")}
          value={
            outputToken && outputAmount
              ? `${toSignificantWithGroupSeparator(
                  new BigNumber(outputAmount).multipliedBy(0.003).multipliedBy(0.8).toString(),
                )} ${outputToken.symbol}`
              : "--"
          }
          tooltip={
            <Tooltip
              iconSize="14px"
              background="#ffffff"
              tips={t`When you place a limit order on ICPSwap, it's like adding a very narrow liquidity position. If your limit order is fully executed, you'll earn at least the minimum amount of transaction fees displayed.`}
            />
          }
        />

        <DetailItem
          label={t("limit.estimated.fee")}
          value={
            swapFeeCost && inputToken && inputTokenPrice
              ? `${parseTokenAmount(swapFeeCost, inputToken.decimals).toFormat()} ${
                  inputToken.symbol
                } (${formatDollarAmount(
                  parseTokenAmount(swapFeeCost, inputToken.decimals).multipliedBy(inputTokenPrice).toString(),
                )})`
              : "--"
          }
          tooltip={<Tooltip iconSize="14px" background="#ffffff" tips={t("limit.estimated.fee.tips")} />}
        />

        <Box sx={{ borderRadius: "12px", background: theme.palette.background.level2, padding: "14px 16px" }}>
          {viewAll ? (
            <Typography sx={{ fontSize: "12px", lineHeight: "20px" }}>
              {t("limit.confirm.description0")}

              <Typography sx={{ fontSize: "12px", lineHeight: "20px", margin: "15px 0 0 0" }}>
                {t("limit.confirm.description1")}
              </Typography>

              <Typography sx={{ fontSize: "12px", lineHeight: "20px", margin: "15px 0 0 0" }}>
                {t("limit.confirm.description2")}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  cursor: "pointer",
                  margin: "15px 0 0 0",
                }}
                color="secondary"
                onClick={() => handleViewAll(false)}
              >
                {t("common.hide")}
              </Typography>
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "12px", lineHeight: "20px" }}>
              {t("limit.confirm.description3")}

              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                color="secondary"
                onClick={() => handleViewAll(true)}
              >
                {t("common.view.all")}
              </Typography>
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ margin: "16px 0 0 0" }}>
        <Button variant="contained" size="large" fullWidth onClick={onConfirm}>
          {t("limit.place.order")}
        </Button>
      </Box>
    </Modal>
  );
}
