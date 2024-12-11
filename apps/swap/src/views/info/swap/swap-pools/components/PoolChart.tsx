import { useState } from "react";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  MainCard,
  ChartDateButtons,
  PoolVolumeChart,
  PoolTvlChart,
  SmallTabsButtonWrapper,
  SmallTabButton,
  ChartView,
  PoolAPRChart,
  APRChartTimeButtons,
} from "@icpswap/ui";
import { DensityChart } from "components/info/DensityChart";
import { ChartTimeEnum, VolumeWindow } from "@icpswap/types";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export const chartViews = [
  { label: t`APR`, value: ChartView.APR },
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
  const [aprTime, setAPRTime] = useState<ChartTimeEnum>(ChartTimeEnum["7D"]);
  const [chartView, setChartView] = useState<ChartView>(ChartView.APR);

  return (
    <MainCard
      level={3}
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 101,
        }}
      >
        <SmallTabsButtonWrapper>
          {chartViews.map((chart) => (
            <SmallTabButton
              key={chart.value}
              onClick={() => setChartView(chart.value)}
              active={chartView === chart.value}
            >
              {chart.label}
            </SmallTabButton>
          ))}
        </SmallTabsButtonWrapper>

        {chartView === ChartView.VOL ? (
          <Box sx={{ margin: "15px 0 0 0" }}>
            <ChartDateButtons volume={volumeWindow} onChange={setVolumeWindow} />
          </Box>
        ) : null}

        {chartView === ChartView.APR ? (
          <Box sx={{ margin: "15px 0 0 0" }}>
            <APRChartTimeButtons time={aprTime} setTime={setAPRTime} />
          </Box>
        ) : null}
      </Box>

      <Box sx={{ "@media(max-width: 640px)": { padding: "60px 0 0 0" } }}>
        {chartView === ChartView.VOL ? (
          <PoolVolumeChart
            canisterId={canisterId}
            volumeWindow={volumeWindow}
            noData={<Box sx={{ height: "340px", width: "auto" }} />}
            defaultValue={volume24H}
          />
        ) : chartView === ChartView.TVL ? (
          <PoolTvlChart canisterId={canisterId} noData={<Box sx={{ height: "340px", width: "auto" }} />} />
        ) : chartView === ChartView.LIQUIDITY ? (
          <DensityChart address={canisterId} token0Price={token0Price} />
        ) : chartView === ChartView.APR ? (
          <PoolAPRChart poolId={canisterId} time={aprTime} />
        ) : null}
      </Box>
    </MainCard>
  );
}
