import { useMemo } from "react";
import { Box } from "@mui/material";
import { ScaleLinear } from "d3";

export interface LineProps {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

export const Line = ({ value, xScale, innerHeight }: LineProps) => {
  return useMemo(
    () => (
      <Box
        sx={{
          strokeWidth: 2,
          stroke: "#ffffff",
          fill: "none",
          strokeDasharray: [1, 5],
        }}
        component="line"
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight],
  );
};
