import { ChartTimeEnum } from "@icpswap/types";

import { Box } from "../Mui";
import { SmallOptionButton } from "./ChartDateButton";

const buttons = [
  { label: "7D", value: ChartTimeEnum["7D"] },
  { label: "30D", value: ChartTimeEnum["30D"] },
];

export interface APRChartTimeButtonsProps {
  setTime: (time: ChartTimeEnum) => void;
  time: ChartTimeEnum;
}

export function APRChartTimeButtons({ time, setTime }: APRChartTimeButtonsProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: "0 8px",
        justifyContent: "flex-end",
      }}
    >
      {buttons.map((e) => (
        <SmallOptionButton key={e.value} active={time === e.value} onClick={() => setTime(e.value)}>
          {e.label}
        </SmallOptionButton>
      ))}
    </Box>
  );
}
