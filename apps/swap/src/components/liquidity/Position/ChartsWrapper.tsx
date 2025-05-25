import { useState } from "react";
import { useTheme, Box } from "components/Mui";
import { MainCard } from "components/index";
import { Position } from "@icpswap/swap-sdk";
import { SmallTabButton, SmallTabsButtonWrapper } from "@icpswap/ui";
import { ChartTimeEnum } from "@icpswap/types";
import i18n from "i18n/index";

import { LiquidityCharts, PositionValueChart, PositionFeesChart, PositionAPRChart } from "./Charts";

enum Charts {
  PriceRange = "Price Range",
  PositionValue = "Position Value",
  APR = "APR",
  Fees = "Fees",
}

const Tabs = [
  { label: i18n.t("common.price.range"), value: Charts.PriceRange },
  { label: i18n.t("liquidity.position.value"), value: Charts.PositionValue },
  { label: i18n.t("common.apr"), value: Charts.APR },
  { label: i18n.t("common.fees"), value: Charts.Fees },
];

const PriceRangeTimeTabs = [
  { label: i18n.t("24H"), value: ChartTimeEnum["24H"] },
  { label: i18n.t("7D"), value: ChartTimeEnum["7D"] },
  { label: i18n.t("30D"), value: ChartTimeEnum["30D"] },
];

const APRTimeTabs = [
  { label: i18n.t("7D"), value: ChartTimeEnum["7D"] },
  { label: i18n.t("30D"), value: ChartTimeEnum["30D"] },
];

interface ChartsWrapperProps {
  position: Position;
  positionId: string;
}

export function ChartsWrapper({ position, positionId }: ChartsWrapperProps) {
  const theme = useTheme();

  const [chartView, setChartView] = useState(Charts.PriceRange);
  const [chartTime, setChartTime] = useState(ChartTimeEnum["30D"]);
  const [aprChartTime, setAPRChartTime] = useState(ChartTimeEnum["7D"]);

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
                setChartTime(ChartTimeEnum["24H"]);
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
        <Box sx={{ minHeight: "388px", overflow: "hidden" }}>
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
