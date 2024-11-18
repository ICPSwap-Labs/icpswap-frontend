import { useState } from "react";
import { useTheme, Box } from "components/Mui";
import { MainCard } from "components/index";
import { Position } from "@icpswap/swap-sdk";
import { SmallTabButton, SmallTabsButtonWrapper } from "@icpswap/ui";
import { t } from "@lingui/macro";
import { APRChartTime } from "@icpswap/types";

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

const PriceRangeTimeTabs = [
  { label: t`24H`, value: APRChartTime["24H"] },
  { label: t`7D`, value: APRChartTime["7D"] },
  { label: t`30D`, value: APRChartTime["30D"] },
];

const APRTimeTabs = [
  { label: t`7D`, value: APRChartTime["7D"] },
  { label: t`30D`, value: APRChartTime["30D"] },
];

interface ChartsWrapperProps {
  position: Position;
  positionId: string;
}

export function ChartsWrapper({ position, positionId }: ChartsWrapperProps) {
  const theme = useTheme();

  const [chartView, setChartView] = useState(Charts.PriceRange);
  const [chartTime, setChartTime] = useState(APRChartTime["24H"]);
  const [aprChartTime, setAPRChartTime] = useState(APRChartTime["7D"]);

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
                setChartTime(APRChartTime["24H"]);
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
        <Box sx={{ height: "366px", overflow: "hidden" }}>
          {chartView === Charts.PriceRange ? (
            <LiquidityCharts position={position} time={chartTime} />
          ) : chartView === Charts.PositionValue ? (
            <PositionValueChart poolId={poolId} positionId={BigInt(positionId)} />
          ) : chartView === Charts.Fees ? (
            <PositionFeesChart poolId={poolId} positionId={BigInt(positionId)} />
          ) : chartView === Charts.APR ? (
            <PositionAPRChart poolId={poolId} positionId={BigInt(positionId)} time={aprChartTime} />
          ) : null}

          {chartView === Charts.PriceRange || chartView === Charts.APR ? (
            <Box sx={{ width: "fit-content", margin: "20px 0 0 0" }}>
              <SmallTabsButtonWrapper
                background={theme.palette.background.level2}
                borderRadius="8px"
                padding="1px"
                border={`1px solid ${theme.palette.background.level4}`}
              >
                {(chartView === Charts.PriceRange ? PriceRangeTimeTabs : APRTimeTabs).map((chart) => (
                  <SmallTabButton
                    key={chart.value}
                    onClick={() =>
                      chartView === Charts.PriceRange ? setChartTime(chart.value) : setAPRChartTime(chart.value)
                    }
                    active={(chartView === Charts.PriceRange ? chartTime : aprChartTime) === chart.value}
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
      </Box>
    </MainCard>
  );
}
