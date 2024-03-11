import { useState, useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { MainCard } from "ui-component/index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import LineChart from "ui-component/LineChart/alt";
import BarChart from "ui-component/BarChart/alt";
import DensityChart from "ui-component/DensityChart";
import ChartToggle, { ChartView } from "ui-component/analytic/ChartViewsButton";
import LoadingImage from "assets/images/loading.png";
import { usePoolTvlChart } from "hooks/info/usePoolTvlChart";
import ChartDateButtons from "ui-component/ChartDateButton";
import { VolumeWindow } from "types/analytic";
import { useTransformedVolumeData } from "hooks/chart";
import { usePoolAllChartData } from "hooks/info/usePoolAllChartData";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export const chartViews = [
  { label: t`Volume`, key: ChartView.VOL },
  { label: t`TVL`, key: ChartView.TVL },
  { label: t`Liquidity`, key: ChartView.LIQUIDITY },
];

function volumeDataFormatter(data: ChartData[]) {
  const oldData = [...data];

  let newData: ChartData[] = [];

  //Fill the empty data between origin data
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
            timestamp: Number(curr.timestamp) + 24 * 3600 * i,
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
      timestamp: Number(endTime) + 24 * 3600 * i,
      txCount: BigInt(0),
    });
  }

  return newData;
}

type ChartData = {
  timestamp: number;
  id: bigint;
  volumeUSD: number;
  txCount: bigint;
};

export interface PoolChartProps {
  canisterId: string;
  token0Price: number | undefined;
  volume24H: number | undefined;
}

export default function PoolChart({ canisterId, token0Price, volume24H }: PoolChartProps) {
  const theme = useTheme() as Theme;

  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const { result: _chartData, loading } = usePoolAllChartData({ poolId: canisterId });

  const chartData: ChartData[] | undefined = useMemo(() => {
    return _chartData
      ?.map((data) => ({
        ...data,
        timestamp: Number(data.timestamp),
      }))
      .filter((data) => data.timestamp !== 0)
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
      });
  }, [_chartData]);

  const [chartView, setChartView] = useState<ChartView>(ChartView.VOL);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: poolChartTVl } = usePoolTvlChart(canisterId);

  const formattedTvlData = useMemo(() => {
    if (poolChartTVl) {
      return poolChartTVl
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
          return {
            time: dayjs(Number(data.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss"),
            value: data.tvlUSD,
          };
        });
    } else {
      return [];
    }
  }, [poolChartTVl]);

  const volumeData = useMemo(() => {
    if (chartData) {
      return volumeDataFormatter(chartData)
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
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
      return volumeDataFormatter(chartData)
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
          return {
            time: dayjs(Number(data.timestamp * 1000)).format("YYYY-MM-DD HH:mm:ss"),
            value: data.volumeUSD,
          };
        });
    }

    return [];
  }, [chartData]);

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
      border={false}
      contentSX={{
        position: "relative",
      }}
    >
      <Box>
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
            ? formatDollarAmount(latestValue)
            : chartView === ChartView.VOL
            ? volume24H
              ? formatDollarAmount(volume24H)
              : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
            : chartView === ChartView.LIQUIDITY
            ? ""
            : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}{" "}
        </Typography>
        <Typography
          color="text.primary"
          fontWeight={500}
          sx={{
            height: "20px",
          }}
          fontSize="12px"
        >
          {valueLabel ? valueLabel : ""}
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            top: "0",
            left: "0",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: theme.palette.background.level2,
            zIndex: 100,
          }}
        >
          <img width="80px" height="80px" src={LoadingImage} alt="" />
        </Box>
      ) : null}

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 101,
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

      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        {chartView === ChartView.VOL ? (
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
        ) : chartView === ChartView.TVL ? (
          formattedTvlData.length > 0 ? (
            <LineChart data={formattedTvlData} setLabel={setValueLabel} minHeight={340} setValue={setLatestValue} />
          ) : (
            <Box sx={{ height: "340px", width: "auto" }} />
          )
        ) : chartView === ChartView.LIQUIDITY ? (
          <DensityChart address={canisterId} token0Price={token0Price} />
        ) : null}
      </Box>
    </MainCard>
  );
}
