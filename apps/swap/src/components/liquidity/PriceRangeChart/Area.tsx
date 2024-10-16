import { useMemo } from "react";
import { area, curveStepAfter, ScaleLinear } from "d3";
import inRange from "lodash/inRange";
import { Box } from "components/Mui";

import { ChartEntry } from "./types";

const COLOR_BLUE_2 = "#0068FC";

export interface AreaProps {
  series: ChartEntry[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xValue: (d: ChartEntry) => number;
  yValue: (d: ChartEntry) => number;
  fill?: string | undefined;
}

export function Area({ series, xScale, yScale, xValue, yValue, fill }: AreaProps) {
  return useMemo(
    () => (
      <Box
        component="path"
        sx={{ opacity: 0.5, stroke: fill ?? COLOR_BLUE_2, fill: fill ?? COLOR_BLUE_2 }}
        fill={fill}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale(xValue(d as ChartEntry)))
            .y1((d: unknown) => yScale(yValue(d as ChartEntry)))
            .y0(yScale(0))(
            series.filter((d) => inRange(xScale(xValue(d)), 0, innerWidth)) as Iterable<[number, number]>,
          ) ?? undefined
        }
      />
    ),
    [fill, series, xScale, xValue, yScale, yValue],
  );
}
