import { useMemo } from "react";
import { Box } from "@mui/material";
import { ScaleLinear } from "d3";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";

export interface LineProps {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

export const Line = ({ value, xScale, innerHeight }: LineProps) => {
  const theme = useTheme() as Theme;

  return useMemo(
    () => (
      <Box
        sx={{
          opacity: 0.5,
          strokeWidth: 2,
          stroke: theme.colors.primaryMain,
          fill: "none",
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
