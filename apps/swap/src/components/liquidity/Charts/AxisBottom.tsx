import { useMemo } from "react";
import { Axis as d3Axis, axisBottom, NumberValue, ScaleLinear, select } from "d3";
import { Box, useTheme } from "components/Mui";

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
  const axisRef = (axis: SVGGElement) => {
    if (axis) {
      select(axis)
        .call(axisGenerator)
        .call((g) => g.select(".domain").remove());
    }
  };

  return <g ref={axisRef} />;
};

interface AxisBottomProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  offset?: number;
}

export function AxisBottom({ xScale, innerHeight, offset = 0 }: AxisBottomProps) {
  const theme = useTheme();

  return useMemo(
    () => (
      <Box
        component="g"
        sx={{
          line: {
            display: "none",
          },
          text: {
            color: theme.colors.darkTextSecondary,
            transform: "translateY(5px)",
          },
        }}
        transform={`translate(0, ${innerHeight + offset})`}
      >
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </Box>
    ),
    [innerHeight, offset, xScale],
  );
}
