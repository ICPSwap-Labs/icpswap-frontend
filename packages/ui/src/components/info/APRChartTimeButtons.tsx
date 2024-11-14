import { APRChartTime } from "@icpswap/types";

import { Box } from "../Mui";
import { SmallOptionButton } from "./ChartDateButton";

const buttons = [
  { label: "7D", value: APRChartTime["7D"] },
  { label: "30D", value: APRChartTime["30D"] },
];

export interface APRChartTimeButtonsProps {
  setTime: (time: APRChartTime) => void;
  time: APRChartTime;
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
