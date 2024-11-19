import { useMemo } from "react";
import { Box } from "components/Mui";
import { ScaleLinear } from "d3";

const ARROW_HEIGHT = 4;

export interface PriceLineProps {
  value: number;
  xScale: ScaleLinear<number, number>;
  height: number;
  color?: string;
  id?: string;
}

export function PriceLine({ value, xScale, height, color = "#ffffff", id = "current" }: PriceLineProps) {
  return useMemo(
    () => (
      <>
        <defs>
          <marker
            id={`liquidity-chart-line-${id}-price_arrow`}
            viewBox="0 0 10 10"
            refX="13"
            refY="5"
            markerWidth={ARROW_HEIGHT}
            markerHeight={ARROW_HEIGHT}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>

        <Box
          sx={{
            strokeWidth: 2,
            stroke: color,
            fill: "none",
            strokeDasharray: [1, 5],
          }}
          component="line"
          x1={xScale(value)}
          y1={14}
          x2={xScale(value)}
          y2={height}
          markerStart={`url(#liquidity-chart-line-${id}-price_arrow)`}
        />
      </>
    ),
    [value, xScale, height],
  );
}
