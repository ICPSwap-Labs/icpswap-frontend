import { usePoolPositionHolders } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { Flex, LoadingRow } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, shorten } from "@icpswap/utils";
import { PieChartTitle } from "components/info/swap/PieChart/PieChartTitle";
import { useEchartsPieChart } from "components/info/tokens/EchartsPie";
import { Box, Typography } from "components/Mui";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toFormat } from "utils/index";

const OTHER_ACCOUNTS = "Other accounts";
const POSITION_SIZE = 20;
const TOP_NUMBER = 20;

export interface PoolPositionHoldersChartsProps {
  poolId: string | Null;
  poolName: string | Null;
}

export function PoolPositionHoldersCharts({ poolId, poolName }: PoolPositionHoldersChartsProps) {
  const { t } = useTranslation();
  const { data: result } = usePoolPositionHolders(poolId, POSITION_SIZE);

  const { topHoldValue, topHoldPercent, totalPositionsValue, totalPositions } = useMemo(() => {
    if (isUndefinedOrNull(result) || isUndefinedOrNull(result.positionList)) return {};

    const topHoldValue = result.positionList.reduce((prev, curr, index) => {
      return index > TOP_NUMBER - 1 ? prev : prev.plus(curr.value);
    }, new BigNumber(0));

    const topHoldPercent = new BigNumber(topHoldValue).dividedBy(result.poolTvlUSD).multipliedBy(100).toFixed(2);

    return {
      topHoldValue: topHoldValue.toString(),
      topHoldPercent,
      totalPositionsValue: result.poolTvlUSD,
      totalPositions: result.totalPositionSize,
    };
  }, [result]);

  const charts = useMemo(() => {
    if (isUndefinedOrNull(result) || isUndefinedOrNull(result.positionList)) return undefined;

    const totalUSDValue = result.poolTvlUSD;

    const top20Holders = [...result.positionList].slice(0, 20).map((element) => {
      const percent = new BigNumber(element.value).dividedBy(totalUSDValue).multipliedBy(100).toFixed(2);
      return {
        value: element.value,
        address: element.accountId,
        percent,
      };
    });

    const top20HoldValue = top20Holders.reduce((prev, curr) => prev.plus(curr.value), new BigNumber(0));

    const otherHoldValue = new BigNumber(totalUSDValue).minus(top20HoldValue).toString();

    const otherAccounts = {
      value: otherHoldValue,
      address: OTHER_ACCOUNTS,
      percent: new BigNumber(otherHoldValue).dividedBy(totalUSDValue).toString(),
    };

    return [...top20Holders, otherAccounts];
  }, [result]);

  const pieRef = useRef<HTMLDivElement | null>(null);
  const pieData = useMemo(() => {
    if (!charts?.length) return [];
    return charts.map((element) => {
      const aid = element.address;
      const name = element.address === OTHER_ACCOUNTS ? "Other accounts" : shorten(aid, 4);
      return {
        name,
        value: new BigNumber(element.percent).toNumber(),
        aid,
      };
    });
  }, [charts]);

  useEchartsPieChart({ containerRef: pieRef, seriesName: "Percentage", data: pieData });

  return (
    <Box sx={{ width: "100%", padding: "0 25px" }}>
      <Box sx={{ width: "100%", overflow: "auto", border: "1px solid #29314F", borderRadius: "16px" }}>
        <PieChartTitle
          content0={t("info.swap.positions.holders.percent", {
            percent: topHoldPercent ? `${topHoldPercent}%` : "--",
            usdValue: topHoldValue ? `$${toFormat(new BigNumber(topHoldValue).toFixed(2))}` : "--",
            poolName: poolName ?? "",
            number: TOP_NUMBER,
          })}
          content1={`${t("common.position.total.value.colon")} ${
            totalPositionsValue ? `$${toFormat(new BigNumber(totalPositionsValue).toFixed(2))}` : "--"
          }`}
          content2={`${t("common.total.positions")} ${totalPositions ?? "--"}`}
        />

        <Box sx={{ margin: "24px 0 0 0" }}>
          <Flex justify="center">
            <Typography color="#ffffff" align="center" fontSize="18px" fontWeight={500}>
              {t("common.top.positions", { number: POSITION_SIZE })}
            </Typography>
          </Flex>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <Flex justify="center" sx={{ height: "400px" }}>
              {isUndefinedOrNull(charts) ? (
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </LoadingRow>
              ) : (
                <Box ref={pieRef} sx={{ width: "100%", height: "100%", minHeight: 360 }} />
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
