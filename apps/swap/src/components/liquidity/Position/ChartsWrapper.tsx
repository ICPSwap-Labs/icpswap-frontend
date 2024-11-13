import { useState } from "react";
import { useTheme, Box } from "components/Mui";
import { MainCard } from "components/index";
import { Position } from "@icpswap/swap-sdk";
import { SmallTabButton, SmallTabsButtonWrapper } from "@icpswap/ui";
import { t } from "@lingui/macro";
import { PositionChartTimes } from "types/swap";

import { LiquidityCharts, PositionValueChart, PositionFeesChart, PositionAPRChart } from "./Charts";

enum Charts {
  PriceRange = "Price Range",
  PositionValue = "Position Value",
  APR = "APR",
  Fees = "Fees",
}

const Tabs = [
  { label: t`Price Range`, value: Charts.PriceRange },
  { label: t`Position Value`, value: Charts.PositionValue },
  { label: t`APR`, value: Charts.APR },
  { label: t`Fees`, value: Charts.Fees },
];

const TimeTabs = [
  { label: t`24H`, value: PositionChartTimes["24H"] },
  { label: t`7D`, value: PositionChartTimes["7D"] },
  { label: t`30D`, value: PositionChartTimes["30D"] },
];

interface ChartsWrapperProps {
  position: Position;
  positionId: string;
}

export function ChartsWrapper({ position, positionId }: ChartsWrapperProps) {
  const theme = useTheme();

  const [chartView, setChartView] = useState(Charts.PriceRange);
  const [chartTime, setChartTime] = useState(PositionChartTimes["24H"]);

  const {
    pool: { id: poolId },
  } = position;

  return (
    <MainCard level={3}>
      <Box sx={{ width: "fit-content" }}>
        <SmallTabsButtonWrapper background={theme.palette.background.level1} borderRadius="8px" padding="4px">
          {Tabs.map((chart) => (
            <SmallTabButton
              key={chart.value}
              onClick={() => {
                setChartTime(PositionChartTimes["24H"]);
                setChartView(chart.value);
              }}
              active={chartView === chart.value}
              background={theme.palette.background.level4}
              borderRadius="8px"
              padding="4px 8px"
            >
              {chart.label}
            </SmallTabButton>
          ))}
        </SmallTabsButtonWrapper>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        {chartView === Charts.PriceRange ? (
          <LiquidityCharts position={position} time={chartTime} />
        ) : chartView === Charts.PositionValue ? (
          <PositionValueChart poolId={poolId} positionId={BigInt(positionId)} />
        ) : chartView === Charts.Fees ? (
          <PositionFeesChart poolId={poolId} positionId={BigInt(positionId)} />
        ) : chartView === Charts.APR ? (
          <PositionAPRChart poolId={poolId} positionId={BigInt(positionId)} time={chartTime} />
        ) : null}

        {chartView === Charts.PriceRange || chartView === Charts.APR ? (
          <Box sx={{ width: "fit-content", margin: "20px 0 0 0" }}>
            <SmallTabsButtonWrapper
              background={theme.palette.background.level2}
              borderRadius="8px"
              padding="2px"
              border={`1px solid ${theme.palette.background.level4}`}
            >
              {TimeTabs.map((chart) => (
                <SmallTabButton
                  key={chart.value}
                  onClick={() => setChartTime(chart.value)}
                  active={chartTime === chart.value}
                  background={theme.palette.background.level1}
                  borderRadius="6px"
                  padding="4px 8px"
                >
                  {chart.label}
                </SmallTabButton>
              ))}
            </SmallTabsButtonWrapper>
          </Box>
        ) : null}
      </Box>
    </MainCard>
  );
}
