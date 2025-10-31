import { useEffect, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { usePoolPositionHolders } from "@icpswap/hooks";
import { Flex, LoadingRow } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, shorten } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { toFormat } from "utils/index";
import * as Highcharts from "highcharts";

const OTHER_ACCOUNTS = "Other accounts";
const POSITION_SIZE = 20;
const TOP_NUMBER = 10;

export interface PoolPositionHoldersChartsProps {
  poolId: string | Null;
  poolName: string | Null;
}

export function PoolPositionHoldersCharts({ poolId, poolName }: PoolPositionHoldersChartsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { result } = usePoolPositionHolders(poolId, POSITION_SIZE);

  const { topHoldValue, topHoldPercent, totalPositionsValue, totalPositions } = useMemo(() => {
    if (isUndefinedOrNull(result)) return {};

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
    if (isUndefinedOrNull(result)) return [];

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

  useEffect(() => {
    if (charts.length) {
      // @ts-ignore
      // The TypeScript compilation shows errors, but the code functions correctly.
      // These errors can be safely ignored, as the official Highcharts documentation uses the same approach.
      Highcharts.chart("highcharts-id", {
        title: undefined,
        credits: false,
        chart: {
          type: "pie",
          backgroundColor: "#212946",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
        },
        tooltip: {
          valueSuffix: "%",
          backgroundColor: "rgba(33, 41, 70, 0.70)",
          borderRadius: 8,
          borderColor: "rgba(73, 88, 142, 0.70)",
          borderWidth: 2,
          style: {
            color: "#ffffff",
          },
          headerFormat: " ",
          pointFormat: "AID: {point.aid}<br/><br />{series.name}: <b>{point.percentage:.2f}%</b>",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: '<span style="font-size: 1em">{point.name}',
              style: {
                color: "#ffffff",
                fontWeight: 400,
                fontFamily: "Poppins",
                fontSize: "12px",
              },
            },
          },
        },
        series: [
          {
            name: "Percentage",
            colorByPoint: true,
            data: charts.map((element) => {
              const aid = element.address;
              const name = element.address === OTHER_ACCOUNTS ? "Other accounts" : shorten(aid, 4);

              return {
                name,
                y: new BigNumber(element.percent).toNumber(),
                aid,
              };
            }),
          },
        ],
      });
    }
  }, [charts]);

  return (
    <Box sx={{ width: "100%", padding: "0 25px" }}>
      <Box sx={{ width: "100%", overflow: "auto", border: "1px solid #29314F", borderRadius: "16px" }}>
        <Flex sx={{ height: "72px", borderBottom: "1px solid #29314F" }}>
          <Box sx={{ flex: "50%" }}>
            <Flex fullWidth gap="0 4px" justify="center">
              <img width="20px" height="20px" src="/images/icons/bulb.svg" alt="" />
              <Typography color="text.primary">
                {t("info.swap.positions.holders.percent", {
                  percent: topHoldPercent ? `${topHoldPercent}%` : "--",
                  usdValue: topHoldValue ? `$${toFormat(new BigNumber(topHoldValue).toFixed(2))}` : "--",
                  poolName: poolName ?? "",
                })}
              </Typography>
            </Flex>
          </Box>

          <Box sx={{ flex: "50%", borderLeft: `1px solid ${theme.palette.border["3"]}` }}>
            <Flex fullWidth justify="center" gap="0 4px">
              <img width="20px" height="20px" src="/images/icons/bulb.svg" alt="" />
              <Flex>
                <Typography color="text.primary" sx={{ paddingRight: "8px" }}>
                  {t("common.position.total.value.colon")}{" "}
                  {totalPositionsValue ? `$${toFormat(new BigNumber(totalPositionsValue).toFixed(2))}` : "--"}
                </Typography>

                <Typography color="text.primary" sx={{ borderLeft: "1px solid #ffffff", paddingLeft: "8px" }}>
                  {t("common.total.positions")} {totalPositions ?? "--"}
                </Typography>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Box sx={{ margin: "24px 0 0 0" }}>
          <Flex justify="center">
            <Typography color="#ffffff" align="center" fontSize="18px" fontWeight={500}>
              {t("common.top.positions", { number: POSITION_SIZE })}
            </Typography>
          </Flex>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <Flex justify="center" sx={{ height: "400px" }}>
              {charts.length === 0 ? (
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
                <Box id="highcharts-id" />
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
