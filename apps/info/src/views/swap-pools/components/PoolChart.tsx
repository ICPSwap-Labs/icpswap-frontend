import { useState, useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  MainCard,
  ChartDateButtons,
  PoolVolumeChart,
  PoolTvlChart,
  MultipleSmallButtonsWrapper,
  MultipleSmallButton,
  ChartView,
} from "@icpswap/ui";
import DensityChart from "ui-component/DensityChart";
import { VolumeWindow } from "@icpswap/types";
import { usePoolTvlChartData } from "@icpswap/hooks";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export const chartViews = [
  { label: t`Volume`, value: ChartView.VOL },
  { label: t`TVL`, value: ChartView.TVL },
  { label: t`Liquidity`, value: ChartView.LIQUIDITY },
];

export interface PoolChartProps {
  canisterId: string;
  token0Price: number | undefined;
  volume24H: number | undefined;
}

export default function PoolChart({ canisterId, token0Price, volume24H }: PoolChartProps) {
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const [chartView, setChartView] = useState<ChartView>(ChartView.VOL);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();
  const [volumeValue, setVolumeValue] = useState<number | undefined>();

  const { result: poolChartTVl } = usePoolTvlChartData(canisterId);

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
    }
    return [];
  }, [poolChartTVl]);

  return (
    <MainCard
      level={2}
      sx={{
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
          {chartView === ChartView.VOL
            ? volumeValue
              ? formatDollarAmount(volumeValue)
              : volume24H
              ? formatDollarAmount(volume24H)
              : ""
            : chartView === ChartView.TVL
            ? latestValue || latestValue === 0
              ? formatDollarAmount(latestValue)
              : null
            : chartView === ChartView.LIQUIDITY
            ? ""
            : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}
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

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 101,
        }}
      >
        <MultipleSmallButtonsWrapper>
          {chartViews.map((chart) => (
            <MultipleSmallButton
              key={chart.value}
              onClick={() => setChartView(chart.value)}
              active={chartView === chart.value}
            >
              {chart.label}
            </MultipleSmallButton>
          ))}
        </MultipleSmallButtonsWrapper>

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
          <PoolVolumeChart
            canisterId={canisterId}
            volumeWindow={volumeWindow}
            noData={<Box sx={{ height: "340px", width: "auto" }} />}
            setValue={setVolumeValue}
            setValueLabel={setValueLabel}
          />
        ) : chartView === ChartView.TVL ? (
          <PoolTvlChart
            canisterId={canisterId}
            setValueLabel={setValueLabel}
            setLatestValue={setLatestValue}
            noData={<Box sx={{ height: "340px", width: "auto" }} />}
          />
        ) : chartView === ChartView.LIQUIDITY ? (
          <DensityChart address={canisterId} token0Price={token0Price} />
        ) : null}
      </Box>
    </MainCard>
  );
}
