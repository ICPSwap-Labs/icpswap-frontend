import { useMemo, useState } from "react";
import { Box } from "components/Mui";
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
  Flex,
} from "@icpswap/ui";
import { DensityChart } from "components/info/DensityChart";
import { ChartTimeEnum, VolumeWindow } from "@icpswap/types";
import i18n from "i18n/index";
import { usePoolCharts } from "@icpswap/hooks";

export const chartViews = [
  { label: i18n.t("common.apr"), value: ChartView.APR },
  { label: i18n.t("common.volume"), value: ChartView.VOL },
  { label: i18n.t("common.tvl"), value: ChartView.TVL },
  { label: i18n.t("common.liquidity"), value: ChartView.LIQUIDITY },
];

export interface PoolChartProps {
  canisterId: string;
  token0Price: number | undefined;
  volume24H: number | string | undefined;
}

export function PoolChart({ canisterId, token0Price, volume24H }: PoolChartProps) {
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);
  const [aprTime, setAPRTime] = useState<ChartTimeEnum>(ChartTimeEnum["7D"]);
  const [chartView, setChartView] = useState<ChartView>(ChartView.APR);

  const { result: poolChartsResult, loading } = usePoolCharts({
    poolId: canisterId,
    level: "d1",
    page: 1,
    limit: 500,
  });

  const poolChartsData = useMemo(() => {
    return poolChartsResult?.content ?? [];
  }, [poolChartsResult]);

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

      <Box sx={{ height: "100%", "@media(max-width: 640px)": { padding: "60px 0 0 0" } }}>
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
          <Flex sx={{ alignItems: "flex-end", height: "100%" }}>
            <DensityChart address={canisterId} token0Price={token0Price} />
          </Flex>
        ) : chartView === ChartView.APR ? (
          <PoolAPRChart poolId={canisterId} time={aprTime} />
        ) : null}
      </Box>
    </MainCard>
  );
}
