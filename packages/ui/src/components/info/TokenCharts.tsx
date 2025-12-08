import { useState, useMemo, useEffect, useCallback, forwardRef, Ref, useImperativeHandle, ReactNode } from "react";
import { BigNumber, formatDollarAmount, formatDollarTokenPrice } from "@icpswap/utils";
import { useTransformedVolumeData, useTokenCharts } from "@icpswap/hooks";
import type { Null, InfoTokenDataResponse } from "@icpswap/types";
import { VolumeWindow } from "@icpswap/constants";
import dayjs from "dayjs";

import { Typography, Box, BoxProps } from "../Mui";
import { LineChartAlt } from "../LineChart/alt";
import { BarChartAlt } from "../BarChart/alt";
import { SwapAnalyticLoading } from "./Loading";
import { ChartDateButtons } from "./ChartDateButton";
import { ChartView } from "./types";
import { Flex } from "../Grid/Flex";
import { MainCard } from "../MainCard";
import { DexScreener } from "../DexScreener";
import { DexTools } from "../DexTools";
import { Select } from "../Select";

export interface ChartButton {
  label: string;
  value: ChartView;
  tokenId?: string | undefined;
}

type VolumeData = {
  volumeUSD: number;
  timestamp: number;
};

function volumeDataFormatter(data: InfoTokenDataResponse[]) {
  const oldData = [...data];
  const newData: Array<VolumeData> = [];

  if (data.length === 0) return [] as Array<VolumeData>;

  // Fill the empty data between origin data
  for (let i = 0; i < oldData.length; i++) {
    const curr = oldData[i];
    const next = oldData[i + 1];

    if (next) {
      const diff = next.beginTime - curr.beginTime;
      const days = parseInt((Number(diff) / (3600 * 24 * 1000)).toString());

      if (days === 1) {
        newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });
      } else {
        // push curr data
        newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });

        for (let i = 1; i < days; i++) {
          newData.push({
            volumeUSD: 0,
            timestamp: Number(curr.beginTime) + 24 * 3600 * 1000 * i,
          });
        }
      }
    } else {
      newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });
    }
  }

  const now = new Date().getTime();
  const endTime = oldData[oldData.length - 1].beginTime;
  const days = parseInt(((now - Number(endTime) * 1000) / (1000 * 3600 * 24)).toString());

  // Fill the latest data to today
  for (let i = 1; i <= days; i++) {
    newData.push({
      volumeUSD: 0,
      timestamp: Number(endTime) + 24 * 3600 * 1000 * i,
    });
  }

  return newData;
}

type PriceLine = {
  open: number;
  close: number;
  high: number;
  low: number;
};

export interface TokenChartsRef {
  setView: (chart: { tokenId?: string; label: string; value: ChartView }) => void;
}

export interface TokenChartsProps {
  canisterId: string | undefined;
  volume?: number | string;
  background?: number;
  borderRadius?: string;
  chartButtons?: ChartButton[];
  showTopIfDexScreen?: boolean;
  dexScreenHeight?: string;
  dexScreenId?: string | Null;
  priceChart?: ReactNode;
  LiquidityChart?: ReactNode;
  onPriceTokenIdChange?: (tokenId: string | Null) => void;
  wrapperSx?: BoxProps["sx"];
  tokenPairWithIcp?: string | Null;
}

export const TokenCharts = forwardRef(
  (
    {
      canisterId,
      volume,
      chartButtons,
      borderRadius,
      background = 2,
      showTopIfDexScreen = true,
      dexScreenHeight,
      dexScreenId,
      priceChart,
      onPriceTokenIdChange,
      wrapperSx,
      tokenPairWithIcp,
      LiquidityChart,
    }: TokenChartsProps,
    ref: Ref<TokenChartsRef>,
  ) => {
    const [priceChartTokenId, setPriceChartTokenId] = useState<string | undefined>(undefined);

    const [chartView, setChartView] = useState<ChartView>(ChartView.PRICE);
    const [valueLabel, setValueLabel] = useState<string | undefined>();
    const [latestValue, setLatestValue] = useState<number | undefined>();
    const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

    const { result: tokenChartsResult, loading } = useTokenCharts({
      tokenId: canisterId,
      level: "d1",
      page: 1,
      limit: 500,
    });

    const tokenCharts = useMemo(() => {
      // TODO: maybe the data is sorted by the backend
      return (tokenChartsResult?.content ?? []).sort((a, b) => {
        if (new BigNumber(a.beginTime).isLessThan(b.beginTime)) return -1;
        if (new BigNumber(a.beginTime).isGreaterThan(b.beginTime)) return 1;
        return 0;
      });
    }, [tokenChartsResult]);

    const formattedTvlData = useMemo(() => {
      return tokenCharts.map((data) => {
        return {
          time: dayjs(Number(data.beginTime)).format("YYYY-MM-DD HH:mm:ss"),
          value: data.tvlUSD,
        };
      });
    }, [tokenCharts]);

    const volumeData = useMemo(() => {
      return volumeDataFormatter(tokenCharts);
    }, [tokenCharts]);

    const dailyVolumeData = useMemo(() => {
      return volumeData.map((ele) => {
        return {
          time: dayjs(ele.timestamp).format("YYYY-MM-DD HH:mm:ss"),
          value: ele.volumeUSD,
        };
      });
    }, [volumeData]);

    const weeklyVolumeData = useTransformedVolumeData(volumeData, "week");
    const monthlyVolumeData = useTransformedVolumeData(volumeData, "month");

    const formattedVolumeData = useMemo(() => {
      if (volumeWindow === VolumeWindow.daily) return dailyVolumeData;
      if (volumeWindow === VolumeWindow.monthly) return monthlyVolumeData;
      return weeklyVolumeData;
    }, [weeklyVolumeData, monthlyVolumeData, dailyVolumeData, volumeWindow]);

    useEffect(() => {
      setPriceChartTokenId(canisterId);
    }, [canisterId]);

    const handleChartViewChange = useCallback(
      (chart: { tokenId?: string; label: string; value: ChartView }) => {
        if (chart.value === ChartView.PRICE) {
          setPriceChartTokenId(chart.tokenId);
          if (onPriceTokenIdChange) onPriceTokenIdChange(chart.tokenId);
        }

        setChartView(chart.value);
      },
      [onPriceTokenIdChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        setView: handleChartViewChange,
      }),
      [handleChartViewChange],
    );

    return (
      <MainCard
        level={background}
        borderRadius={borderRadius}
        sx={{
          position: "relative",
          ...wrapperSx,
        }}
        padding="0"
      >
        <SwapAnalyticLoading loading={loading} />

        <Flex
          fullWidth
          justify="space-between"
          align="flex-start"
          sx={{
            height: "70px",
            padding: "16px",
            display:
              chartView === ChartView.PRICE && priceChart
                ? "none"
                : chartView === ChartView.DexScreener || chartView === ChartView.DexTools
                ? showTopIfDexScreen
                  ? "flex"
                  : "none"
                : "flex",
          }}
        >
          <Box>
            <Typography
              color="text.primary"
              fontSize="24px"
              fontWeight={500}
              sx={{
                width: "100%",
                display: "flex",
                height: "30px",
                gap: "0 12px",
                alignItems: "center",
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  gap: "4px 0",
                  alignItems: "flex-start",
                  height: "fit-content",
                },
              }}
              component="div"
            >
              {latestValue || latestValue === 0
                ? chartView === ChartView.TRANSACTIONS
                  ? latestValue
                  : chartView === ChartView.PRICE
                  ? formatDollarTokenPrice(latestValue)
                  : formatDollarAmount(latestValue)
                : chartView === ChartView.VOL
                ? volume
                  ? formatDollarAmount(volume)
                  : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                : chartView === ChartView.TVL
                ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
                : "--"}
            </Typography>

            <Typography
              color="text.primary"
              fontWeight={500}
              sx={{
                height: "20px",
              }}
              fontSize="12px"
            >
              {valueLabel || ""}
            </Typography>
          </Box>

          <Box>
            {chartButtons && chartButtons.length > 0 ? (
              <Flex
                gap="0 8px"
                wrap="wrap-reverse"
                justify="flex-end"
                sx={{ "@media(max-width: 640px)": { gap: "8px 0" } }}
              >
                <Select
                  menus={chartButtons.map((element) => ({
                    label: element.label,
                    value: element.tokenId ? `${element.value}_${element.tokenId}` : element.value,
                  }))}
                  minMenuWidth="140px"
                  menuMaxHeight="240px"
                  onChange={(value: any) => {
                    const chart = chartButtons.find(
                      (element) => (element.tokenId ? `${element.value}_${element.tokenId}` : element.value) === value,
                    );
                    handleChartViewChange(chart);
                  }}
                  value={chartView === ChartView.PRICE ? `${chartView}_${priceChartTokenId}` : chartView}
                  showBackground={false}
                  showClean={false}
                  panelPadding="0"
                />
              </Flex>
            ) : null}

            {chartView === ChartView.VOL ? (
              <Box sx={{ margin: "15px 0 0 0" }}>
                <ChartDateButtons volume={volumeWindow} onChange={setVolumeWindow} />
              </Box>
            ) : null}
          </Box>
        </Flex>

        <Box
          sx={{
            margin: priceChart
              ? "0"
              : chartView === ChartView.DexScreener
              ? showTopIfDexScreen
                ? "10px 0 0 0 "
                : "0px"
              : "10px 0 0 0",
          }}
        >
          {chartView === ChartView.TVL ? (
            formattedTvlData.length > 0 ? (
              <LineChartAlt
                data={formattedTvlData}
                setLabel={setValueLabel}
                minHeight={340}
                setValue={setLatestValue}
                value={latestValue}
                label={valueLabel}
              />
            ) : (
              <Box sx={{ height: "340px", width: "auto" }} />
            )
          ) : chartView === ChartView.VOL ? (
            formattedVolumeData && formattedVolumeData.length > 0 ? (
              <BarChartAlt
                data={formattedVolumeData}
                minHeight={340}
                setValue={setLatestValue}
                setLabel={setValueLabel}
                value={latestValue}
                label={valueLabel}
                activeWindow={
                  volumeWindow === VolumeWindow.daily
                    ? "daily"
                    : volumeWindow === VolumeWindow.monthly
                    ? "monthly"
                    : "weekly"
                }
              />
            ) : (
              <Box sx={{ height: "340px", width: "auto" }} />
            )
          ) : chartView === ChartView.PRICE ? (
            priceChart
          ) : chartView === ChartView.DexScreener ? (
            <DexScreener id={dexScreenId ?? canisterId} height={dexScreenHeight ?? "420px"} />
          ) : chartView === ChartView.DexTools ? (
            <DexTools id={tokenPairWithIcp ?? canisterId} height={dexScreenHeight ?? "420px"} />
          ) : chartView === ChartView.LIQUIDITY ? (
            LiquidityChart
          ) : null}
        </Box>
      </MainCard>
    );
  },
);
