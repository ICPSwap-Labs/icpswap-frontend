import { useState, useMemo, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { BigNumber, toSignificant, formatDollarAmount } from "@icpswap/utils";
import { useTransformedVolumeData, useTokenTvlChart, useTokenVolChart, useTokenPriceChart } from "@icpswap/hooks";
import type { PublicTokenChartDayData, InfoPriceChartData } from "@icpswap/types";
import { VolumeWindow } from "@icpswap/constants";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { LineChartAlt } from "../LineChart/alt";
import { BarChartAlt } from "../BarChart/alt";
import { CandleChart } from "../CandleChart/index";
import { ChartDateButtons } from "./ChartDateButton";

import { ChartToggle, ChartView } from "./Button";
import { SwapAnalyticLoading } from "./Loading";

import { MainCard } from "../MainCard";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

function priceChartFormat(data: InfoPriceChartData[]) {
  return data
    .filter((d) => {
      // ICVC
      if (d.id === "m6xut-mqaaa-aaaaq-aadua-cai") {
        const time = new Date("2024-08-28").getTime();
        return new BigNumber(d.time).multipliedBy(1000).isGreaterThan(time);
      }

      // SNS1
      if (d.id === "zfcdd-tqaaa-aaaaq-aaaga-cai") {
        const time = new Date("2024-03-12").getTime();
        return !new BigNumber(d.time).multipliedBy(1000).isLessThan(time);
      }

      return true;
    })
    .map((d, index) => {
      return {
        ...d,
        open: d.timestamp.toString() === "1686787200" ? data[index - 1].close : d.open,
        close:
          d.timestamp.toString() === "1686787200" || d.timestamp.toString() === "1686873600"
            ? data[index + 1]?.open ?? d.close
            : d.close,
        low:
          d.timestamp.toString() === "1686787200"
            ? data[index - 1].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? data[index - 1]?.close ?? 0
              : data[index - 1].close
            : d.timestamp.toString() === "1686873600"
            ? data[index - 2].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? 0
              : data[index - 2]?.close ?? 0
            : d.low,
        timestamp: undefined,
      };
    });
}

export const chartViews = [
  { label: `Volume`, key: ChartView.VOL },
  { label: `TVL`, key: ChartView.TVL },
  { label: `Price`, key: ChartView.PRICE },
];

function volumeDataFormatter(data: PublicTokenChartDayData[]) {
  const oldData = [...data];
  const newData: PublicTokenChartDayData[] = [];

  if (data.length === 0) return [] as PublicTokenChartDayData[];

  // Fill the empty data between origin data
  for (let i = 0; i < oldData.length; i++) {
    const curr = oldData[i];
    const next = oldData[i + 1];

    if (next) {
      const diff = next.timestamp - curr.timestamp;
      const days = parseInt((Number(diff) / (3600 * 24)).toString());

      if (days === 1) {
        newData.push(curr);
      } else {
        // push curr data
        newData.push(curr);

        for (let i = 1; i < days; i++) {
          newData.push({
            id: BigInt(0),
            volumeUSD: 0,
            timestamp: BigInt(Number(curr.timestamp) + 24 * 3600 * i),
            txCount: BigInt(0),
          });
        }
      }
    } else {
      newData.push(curr);
    }
  }

  const now = new Date().getTime();
  const endTime = oldData[oldData.length - 1].timestamp;
  const days = parseInt(((now - Number(endTime) * 1000) / (1000 * 3600 * 24)).toString());

  // Fill the latest data to today
  for (let i = 1; i <= days; i++) {
    newData.push({
      id: BigInt(0),
      volumeUSD: 0,
      timestamp: BigInt(Number(endTime) + 24 * 3600 * i),
      txCount: BigInt(0),
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

export type PriceToggle = {
  label: string;
  id: string;
};
export interface TokenChartsProps {
  canisterId: string | undefined;
  volume?: number;
  background?: number;
  borderRadius?: string;
  priceToggles?: PriceToggle[];
}

export function TokenCharts({ canisterId, volume, borderRadius, priceToggles, background = 2 }: TokenChartsProps) {
  const [priceChartTokenId, setPriceChartTokenId] = useState<string | undefined>(undefined);

  const { result: chartData } = useTokenVolChart(canisterId);

  const [chartView, setChartView] = useState<ChartView>(ChartView.PRICE);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();
  const [priceData, setPriceData] = useState<PriceLine | null | undefined>(null);
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const { priceChartData: __priceChartData, loading: priceChartLoading } = useTokenPriceChart(
    priceChartTokenId ?? canisterId,
  );

  const priceChartData = useMemo(() => {
    if (!__priceChartData) return undefined;

    return priceChartFormat(__priceChartData);
  }, [__priceChartData]);

  const { result: tvlChartData } = useTokenTvlChart(canisterId);

  const formattedTvlData = useMemo(() => {
    if (tvlChartData) {
      return tvlChartData.map((data) => {
        return {
          time: dayjs(Number(data.timestamp * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss"),
          value: data.tvlUSD,
        };
      });
    }
    return [];
  }, [tvlChartData]);

  const volumeData = useMemo(() => {
    if (chartData) {
      return volumeDataFormatter(chartData.filter((ele) => ele.timestamp !== BigInt(0))).map((data) => {
        return {
          date: Number(data.timestamp),
          volumeUSD: data.volumeUSD,
        };
      });
    }
    return [];
  }, [chartData]);

  const dailyVolumeData = useMemo(() => {
    if (chartData) {
      return volumeData.map((ele) => {
        return {
          time: dayjs(ele.date * 1000).format("YYYY-MM-DD HH:mm:ss"),
          value: ele.volumeUSD,
        };
      });
    }
    return [];
  }, [volumeData]);

  const handlePriceHoverChange = (data: any) => {
    setPriceData(data as PriceLine);
  };

  const weeklyVolumeData = useTransformedVolumeData(volumeData, "week");
  const monthlyVolumeData = useTransformedVolumeData(volumeData, "month");

  const formattedVolumeData = useMemo(() => {
    if (volumeWindow === VolumeWindow.daily) return dailyVolumeData;
    if (volumeWindow === VolumeWindow.monthly) return monthlyVolumeData;
    return weeklyVolumeData;
  }, [weeklyVolumeData, monthlyVolumeData, dailyVolumeData, volumeWindow]);

  const handleTogglePrice = (id: string) => {
    setPriceChartTokenId(id);
  };

  useEffect(() => {
    setPriceChartTokenId(canisterId);
  }, [canisterId]);

  return (
    <MainCard
      level={background}
      borderRadius={borderRadius}
      sx={{
        position: "relative",
      }}
    >
      <SwapAnalyticLoading loading={priceChartLoading} />

      <Box sx={{ height: "70px" }}>
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
              : formatDollarAmount(latestValue)
            : chartView === ChartView.VOL
            ? volume
              ? formatDollarAmount(volume)
              : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
            : chartView === ChartView.TVL
            ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
            : priceChartData
            ? formatDollarAmount(priceChartData[priceChartData.length - 1]?.close)
            : "--"}

          {chartView === ChartView.PRICE && priceToggles ? (
            <Box sx={{ display: "flex" }}>
              {priceToggles.map((e, index) => (
                <Typography
                  key={e.id}
                  color={priceChartTokenId === e.id ? "text.theme-secondary" : "text.secondary"}
                  fontWeight={500}
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleTogglePrice(e.id)}
                >
                  {index !== 0 ? (
                    <Typography component="span" fontWeight={500}>
                      /
                    </Typography>
                  ) : (
                    ""
                  )}
                  {priceToggles[index].label}
                </Typography>
              ))}
            </Box>
          ) : null}
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

        {priceData ? (
          <Typography
            color="text.primary"
            fontWeight={500}
            sx={{
              height: "20px",
            }}
            fontSize="12px"
          >
            O:{toSignificant(priceData.open, 4)} H: {toSignificant(priceData.high, 4)} L:{" "}
            {toSignificant(priceData.low, 4)} C: {toSignificant(priceData.close, 4)}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <ChartToggle
          chartViews={chartViews}
          activeView={chartView}
          setActiveChartView={(chartView) => setChartView(chartView)}
        />

        {chartView === ChartView.VOL ? (
          <Box sx={{ margin: "15px 0 0 0" }}>
            <ChartDateButtons volume={volumeWindow} onChange={setVolumeWindow} />
          </Box>
        ) : null}
      </Box>

      <Box mt="20px">
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
          priceChartData && priceChartData.length > 0 ? (
            <CandleChart
              height={340}
              data={priceChartData}
              setValue={setLatestValue}
              setLabel={setValueLabel}
              onHoverChange={handlePriceHoverChange}
            />
          ) : (
            <Box sx={{ height: "340px", width: "auto" }} />
          )
        ) : null}
      </Box>
    </MainCard>
  );
}
