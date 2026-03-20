import { usePoolCharts } from "@icpswap/hooks";
import { ChartTimeEnum, VolumeWindow } from "@icpswap/types";
import {
  APRChartTimeButtons,
  ChartDateButtons,
  ChartView,
  PoolAPRChart,
  PoolTvlChart,
  PoolVolumeChart,
  SmallTabButton,
  SmallTabsButtonWrapper,
} from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { DensityChart } from "components/info/DensityChart";
import { Box } from "components/Mui";
import i18n from "i18n/index";
import { useMemo, useState } from "react";

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

  const { data: poolChartsResult, isLoading: loading } = usePoolCharts({
    poolId: canisterId,
    level: "d1",
    page: 1,
    limit: 500,
  });

  const poolChartsData = useMemo(() => {
    if (isUndefinedOrNull(poolChartsResult)) return [];
    return poolChartsResult.content ? [...poolChartsResult.content].reverse() : [];
  }, [poolChartsResult]);

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
            volumeWindow={volumeWindow}
            noData={<Box sx={{ height: "340px", width: "auto" }} />}
            defaultValue={volume24H}
            loading={loading}
            chartsData={poolChartsData}
          />
        ) : chartView === ChartView.TVL ? (
          <PoolTvlChart
            noData={<Box sx={{ height: "340px", width: "auto" }} />}
            chartsData={poolChartsData}
            loading={loading}
          />
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
