import { useMemo } from "react";
import { area, curveStepAfter, ScaleLinear } from "d3";
import inRange from "lodash/inRange";
import { Box } from "components/Mui";
import { SWAP_CHART_RANGE_AREA_COLOR } from "constants/swap";

import { ChartEntry } from "./types";

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
        sx={{ opacity: 0.5, stroke: fill ?? SWAP_CHART_RANGE_AREA_COLOR, fill: fill ?? SWAP_CHART_RANGE_AREA_COLOR }}
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
