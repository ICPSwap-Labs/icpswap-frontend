import { ChartTimeEnum } from "@icpswap/types";
import { useTheme } from "components/Mui";
import { SmallTabButton, SmallTabsButtonWrapper } from "@icpswap/ui";

const buttons = [
  { label: "24H", value: ChartTimeEnum["24H"] },
  { label: "7D", value: ChartTimeEnum["7D"] },
  { label: "30D", value: ChartTimeEnum["30D"] },
];

export interface PriceRangeChartTimeButtonsProps {
  setTime: (time: ChartTimeEnum) => void;
  time: ChartTimeEnum;
}

export function PriceRangeChartTimeButtons({ time, setTime }: PriceRangeChartTimeButtonsProps) {
  const theme = useTheme();

  return (
    <SmallTabsButtonWrapper
      borderRadius="8px"
      padding="2px"
      border={`1px solid ${theme.palette.background.level4}`}
      background={theme.palette.background.level2}
    >
      {buttons.map((e) => (
        <SmallTabButton
          key={e.value}
          active={time === e.value}
          onClick={() => setTime(e.value)}
          borderRadius="6px"
          padding="4px 8px"
          background={theme.palette.background.level1}
        >
          {e.label}
        </SmallTabButton>
      ))}
    </SmallTabsButtonWrapper>
  );
}
