import { useState, useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { BigNumber, toSignificant, formatDollarAmount } from "@icpswap/utils";
import { MainCard } from "ui-component/index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import LineChart from "ui-component/LineChart/alt";
import BarChart from "ui-component/BarChart/alt";
import CandleChart from "ui-component/CandleChart";
import ChartToggle, { ChartView } from "ui-component/analytic/ChartViewsButton";
import SwapAnalyticLoading from "ui-component/analytic/Loading";
import { useTokenTvlChart } from "hooks/info/useTokenTvlChart";
import { useTokenVolChart } from "hooks/info/useTokenVolChart";
import { useTokenPriceChart } from "hooks/info/useTokenPriceChart";
import { PublicTokenChartDayData } from "types/info";
import ChartDateButtons from "ui-component/ChartDateButton";
import { VolumeWindow } from "types/analytic";
import { useTransformedVolumeData } from "hooks/chart";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export const chartViews = [
  { label: t`Volume`, key: ChartView.VOL },
  { label: t`TVL`, key: ChartView.TVL },
  { label: t`Price`, key: ChartView.PRICE },
];

export interface TokenChartsProps {
  canisterId: string;
  volume?: number;
}

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

export function TokenCharts({ canisterId, volume }: TokenChartsProps) {
  const { result: chartData } = useTokenVolChart(canisterId);

  const [chartView, setChartView] = useState<ChartView>(ChartView.PRICE);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();
  const [priceData, setPriceData] = useState<PriceLine | null | undefined>(null);
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const { priceChartData: _priceChartData, loading: priceChartLoading } = useTokenPriceChart(canisterId);

  const priceChartData = useMemo(() => {
    if (!_priceChartData) return undefined;

    if (canisterId === "zfcdd-tqaaa-aaaaq-aaaga-cai") {
      return _priceChartData.filter((e) => {
        const time = new Date("2024-03-12").getTime();
        return !new BigNumber(e.time).multipliedBy(1000).isLessThan(time);
      });
    }

    return _priceChartData;
  }, [_priceChartData]);

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

  return (
    <MainCard
      level={2}
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
            height: "30px",
            "@media (max-width: 640px)": {
              margin: "40px 0 0 0",
            },
          }}
        >
          {latestValue || latestValue === 0
            ? chartView === ChartView.TRANSACTIONS
              ? latestValue
              : formatDollarAmount(latestValue, 2)
            : chartView === ChartView.VOL
            ? volume
              ? formatDollarAmount(volume)
              : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
            : chartView === ChartView.TVL
            ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
            : priceChartData
            ? formatDollarAmount(priceChartData[priceChartData.length - 1]?.close, 2)
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
            <LineChart
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
            <BarChart
              data={formattedVolumeData}
              minHeight={340}
              setValue={setLatestValue}
              setLabel={setValueLabel}
              value={latestValue}
              label={valueLabel}
              activeWindow={volumeWindow}
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
