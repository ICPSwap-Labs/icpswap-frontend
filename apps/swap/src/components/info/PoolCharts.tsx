import { useState } from "react";
import { Box } from "components/Mui";
import {
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
import { VolumeWindow, ChartTimeEnum } from "@icpswap/types";
import i18n from "i18n/index";

export const chartViews = [
  { label: i18n.t("common.apr"), value: ChartView.APR },
  { label: i18n.t("common.volume"), value: ChartView.VOL },
  { label: i18n.t("common.tvl"), value: ChartView.TVL },
  { label: i18n.t("common.liquidity"), value: ChartView.LIQUIDITY },
];

export interface PoolChartProps {
  canisterId: string;
  token0Price: number | undefined;
  volume24H?: number | undefined;
}

export function PoolCharts({ canisterId, token0Price, volume24H }: PoolChartProps) {
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);
  const [aprTime, setAPRTime] = useState<ChartTimeEnum>(ChartTimeEnum["7D"]);
  const [chartView, setChartView] = useState<ChartView>(ChartView.APR);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "320px",
        "@media(max-width: 640px)": {
          padding: "60px 0 0 0",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "0px",
          right: "0px",
          zIndex: 101,
        }}
      >
        <SmallTabsButtonWrapper padding="1px">
          {chartViews.map((chart) => (
            <SmallTabButton
              key={chart.value}
              onClick={() => setChartView(chart.value)}
              active={chartView === chart.value}
              borderRadius="40px"
              padding="2px 10px"
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

      <Box>
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
          <Box sx={{ padding: "40px 0 0 0", "@media(max-width: 640px)": { padding: "0px" } }}>
            <DensityChart address={canisterId} token0Price={token0Price} />
          </Box>
        ) : chartView === ChartView.APR ? (
          <PoolAPRChart poolId={canisterId} time={aprTime} />
        ) : null}
      </Box>
    </Box>
  );
}
