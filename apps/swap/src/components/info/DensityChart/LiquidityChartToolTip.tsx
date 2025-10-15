import { Flex, GridRowBetween, Proportion } from "@icpswap/ui";
import { Typography, Box, useTheme } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { formatAmount, BigNumber, formatTokenPrice, formatDollarTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { useUSDPrice } from "hooks";
import { useMemo } from "react";

import { ChartEntry } from "./type";

interface LiquidityChartToolTipProps {
  chartProps: any;
  token0: Token | undefined;
  token1: Token | undefined;
  currentPrice: number | undefined;
  data: ChartEntry[] | undefined;
}

export function LiquidityChartToolTip({ chartProps, token0, token1, currentPrice, data }: LiquidityChartToolTipProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const price0 = chartProps?.payload?.[0]?.payload.price0;
  const price1 = chartProps?.payload?.[0]?.payload.price1;
  const tvlToken0 = chartProps?.payload?.[0]?.payload.tvlToken0;
  const tvlToken1 = chartProps?.payload?.[0]?.payload.tvlToken1;
  const index = chartProps?.payload?.[0]?.payload.index;
  const isCurrent = chartProps?.payload?.[0]?.payload.isCurrent;

  const token0USDPrice = useUSDPrice(token0);
  const token1USDPrice = useUSDPrice(token1);

  const { lockedToken0Amount, lockedToken1Amount } = useMemo(() => {
    if (
      isUndefinedOrNull(data) ||
      isUndefinedOrNull(index) ||
      isUndefinedOrNull(currentPrice) ||
      isUndefinedOrNull(price0)
    )
      return {};

    let lockedToken0Amount = new BigNumber(0);
    let lockedToken1Amount = new BigNumber(0);

    if (currentPrice > price0) {
      for (let i = index; i < data.length; i++) {
        const __data = data[i];
        if (!__data.isCurrent) {
          lockedToken0Amount = lockedToken0Amount.plus(__data.tvlToken0);
          lockedToken1Amount = lockedToken1Amount.plus(__data.tvlToken1);
        } else {
          break;
        }
      }

      return {
        lockedToken0Amount: lockedToken0Amount.toString(),
        lockedToken1Amount: lockedToken1Amount.toString(),
      };
    }

    let isCurrent = false;

    for (let i = 0; i <= index; i++) {
      const __data = data[i];

      if (__data.isCurrent) {
        isCurrent = true;
      }

      if (isCurrent) {
        lockedToken0Amount = lockedToken0Amount.plus(__data.tvlToken0);
        lockedToken1Amount = lockedToken1Amount.plus(__data.tvlToken1);
      }
    }

    return {
      lockedToken0Amount: lockedToken0Amount.toString(),
      lockedToken1Amount: lockedToken1Amount.toString(),
    };
  }, [data, index, currentPrice, price0]);

  return (
    <Box
      sx={{
        padding: "12px",
        width: "320px",
        opacity: 0.8,
        zIndex: "10",
        borderRadius: "12px",
        background: theme.palette.background.level3,
        border: `1px solid ${theme.palette.background.level4}`,
      }}
    >
      <Flex gap="16px 0" vertical>
        <Flex justify="space-between" fullWidth align="flex-start">
          <Typography color="text.primary" fontSize="12px">
            Price:
          </Typography>

          <Flex vertical gap="6px 0" justify="flex-start" align="flex-end">
            <Typography color="text.primary" fontSize="12px">
              {price0
                ? `1 ${token0?.symbol} = ${formatTokenPrice(price0)} ${token1?.symbol}${
                    token0USDPrice && isCurrent ? ` = ${formatDollarTokenPrice(token0USDPrice)}` : ""
                  }`
                : ""}
            </Typography>

            <Typography color="text.primary" fontSize="12px">
              {price1
                ? `1 ${token1?.symbol} = ${formatTokenPrice(price1)} ${token0?.symbol}${
                    token1USDPrice && isCurrent ? ` = ${formatDollarTokenPrice(token1USDPrice)}` : ""
                  }`
                : ""}
            </Typography>
          </Flex>
        </Flex>

        <GridRowBetween>
          <Typography color="text.primary" fontSize="12px">
            {t("swap.price.deviation")}
          </Typography>
          <Proportion
            value={
              currentPrice
                ? new BigNumber(price0).minus(currentPrice).dividedBy(currentPrice).multipliedBy(100).toString()
                : undefined
            }
          />
        </GridRowBetween>

        <>
          <GridRowBetween>
            <Typography color="text.primary" fontSize="12px">
              {currentPrice && price0 && currentPrice < price0 ? token0?.symbol : token1?.symbol} Locked:{" "}
            </Typography>
            <Typography color="text.primary" fontSize="12px">
              {currentPrice && price0 && currentPrice < price0
                ? `${tvlToken0 ? formatAmount(tvlToken0) : ""} ${token0?.symbol}`
                : `${tvlToken1 ? formatAmount(tvlToken1) : ""} ${token1?.symbol}`}
            </Typography>
          </GridRowBetween>
          <GridRowBetween>
            <Typography color="text.primary" fontSize="12px">
              Swap quote:
            </Typography>
            <Typography color="text.primary" fontSize="12px">
              {lockedToken0Amount && lockedToken1Amount
                ? `${formatAmount(lockedToken1Amount)} ${token1?.symbol} → ${formatAmount(
                    lockedToken0Amount,
                  )} ${token0?.symbol}`
                : ""}
            </Typography>
          </GridRowBetween>
        </>
      </Flex>
    </Box>
  );
}
