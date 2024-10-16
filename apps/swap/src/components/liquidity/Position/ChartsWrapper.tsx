// import { useState } from "react";
import { useTheme, Box } from "components/Mui";
import { MainCard } from "components/index";
import { Position } from "@icpswap/swap-sdk";
// import { SmallTabButton, SmallTabsButtonWrapper } from "@icpswap/ui";
import { t } from "@lingui/macro";

import { LiquidityCharts } from "./Charts";

enum Charts {
  PriceRange = "Price Range",
  PositionValue = "Position Value",
  APR = "APR",
  Fees = "Fees",
}

enum Times {
  "24H" = "24H",
  "7D" = "7D",
  "30D" = "30D",
}

const Tabs = [
  { label: t`Price Range`, value: Charts.PriceRange },
  { label: t`Position Value`, value: Charts.PositionValue },
  { label: t`APR`, value: Charts.APR },
  { label: t`Fees`, value: Charts.Fees },
];

const TimeTabs = [
  { label: t`24H`, value: Times["24H"] },
  { label: t`7D`, value: Times["7D"] },
  { label: t`30D`, value: Times["30D"] },
];

interface ChartsWrapperProps {
  position: Position;
  positionId: string;
}

export function ChartsWrapper({ position, positionId }: ChartsWrapperProps) {
  // const theme = useTheme();

  // const [chartView, setChartView] = useState(Charts.PriceRange);
  // const [chartTime, setChartTime] = useState(Times["24H"]);

  return (
    <MainCard level={3}>
      {/* <Box sx={{ width: "fit-content" }}>
        <SmallTabsButtonWrapper background={theme.palette.background.level1} borderRadius="8px" padding="4px">
          {Tabs.map((chart) => (
            <SmallTabButton
              key={chart.value}
              onClick={() => setChartView(chart.value)}
              active={chartView === chart.value}
              background={theme.palette.background.level4}
              borderRadius="8px"
              padding="4px 8px"
            >
              {chart.label}
            </SmallTabButton>
          ))}
        </SmallTabsButtonWrapper>
      </Box> */}

      {/* <Box sx={{ margin: "20px 0 0 0" }}> */}
      <Box sx={{ margin: "0 0 0 0" }}>
        <LiquidityCharts position={position} />

        {/* {chartView === Charts.PriceRange ? (
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
        ) : null} */}
      </Box>
    </MainCard>
  );
}
