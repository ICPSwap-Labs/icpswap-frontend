import { max, scaleLinear, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bound } from "constants/swap";
import { useTheme } from "components/Mui";

import { Area } from "components/liquidity/PriceRangeChart/Area";
import { AxisBottom } from "components/liquidity/PriceRangeChart/AxisBottom";
import { Line } from "components/liquidity/PriceRangeChart/Line";
import Zoom, { ZoomOverlay } from "components/liquidity/PriceRangeChart/Zoom";
import { ChartEntry, ZoomLevels, Dimensions, Margins } from "components/liquidity/PriceRangeChart/types";
import type { Null, PositionPricePeriodRange } from "@icpswap/types";

export const xAccessor = (d: ChartEntry) => d.price0;
export const yAccessor = (d: ChartEntry) => d.activeLiquidity;

interface LiquidityChartsProps {
  // to distringuish between multiple charts in the DOM
  id?: string;
  data: {
    series: ChartEntry[];
    current: number;
    lower?: number;
    upper?: number;
  };
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  styles: {
    area: {
      // color of the ticks in range
      selection: string;
    };
    brush: {
      handle: {
        west: string;
        east: string;
      };
    };
  };
  dimensions: Dimensions;
  margins: Margins;
  interactive?: boolean;
  brushLabels: (d: "w" | "e", x: number) => string;
  brushDomain: [number, number] | undefined;
  onBrushDomainChange: (domain: [number, number], mode: string | undefined) => void;
  zoomLevels: ZoomLevels;
  periodPriceRange: PositionPricePeriodRange | Null;
}

export function Chart({
  id = "liquidityChartRangeInput",
  data: { series, current, lower, upper },
  dimensions: { width, height },
  margins,
  brushDomain,
  onBrushDomainChange,
  zoomLevels,
  periodPriceRange,
}: LiquidityChartsProps) {
  const theme = useTheme();
  const zoomRef = useRef<SVGRectElement | null>(null);

  const [zoom, setZoom] = useState<ZoomTransform | null>(null);

  const [innerHeight, innerWidth] = useMemo(
    () => [height - margins.top - margins.bottom, width - margins.left - margins.right],
    [width, height, margins],
  );

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear()
        .domain([current * zoomLevels.initialMin, current * zoomLevels.initialMax] as number[])
        .range([0, innerWidth]),
      yScale: scaleLinear()
        .domain([0, max(series, yAccessor)] as number[])
        .range([innerHeight, 0]),
    };

    if (zoom) {
      const newXscale = zoom.rescaleX(scales.xScale);
      scales.xScale.domain(newXscale.domain());
    }

    return scales;
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, innerWidth, series, innerHeight, zoom]);

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null);
  }, [zoomLevels]);

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange(xScale.domain() as [number, number], undefined);
    }
  }, [brushDomain, onBrushDomainChange, xScale]);

  console.log("series: ", series);

  return (
    <>
      <Zoom
        svg={zoomRef.current}
        xScale={xScale}
        setZoom={setZoom}
        width={innerWidth}
        height={
          // allow zooming inside the x-axis
          height
        }
        resetBrush={() => {
          onBrushDomainChange(
            [current * zoomLevels.initialMin, current * zoomLevels.initialMax] as [number, number],
            "reset",
          );
        }}
        zoomLevels={zoomLevels}
        noIcons
      />

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {/* {periodPriceRange && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect fill="white" x={xScale(0.001)} y="0" width={xScale(0.004) - xScale(0.001)} height={innerHeight} />
            </mask>
          )} */}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area series={series} xScale={xScale} yScale={yScale} xValue={xAccessor} yValue={yAccessor} />

            {/* {periodPriceRange && (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <rect
                  fill="white"
                  x={xScale(0.001)}
                  y={10}
                  width={xScale(0.004) - xScale(0.001)}
                  height={innerHeight}
                  opacity={0.2}
                />
              </g>
            )} */}

            <Line value={current} xScale={xScale} height={innerHeight} />
            {lower ? (
              <Line id="lower" value={lower} xScale={xScale} height={innerHeight} color={theme.colors.primaryMain} />
            ) : null}
            {upper ? (
              <Line id="upper" value={upper} xScale={xScale} height={innerHeight} color={theme.colors.primaryMain} />
            ) : null}

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <ZoomOverlay width={innerWidth} height={height} ref={zoomRef} />
        </g>
      </svg>
    </>
  );
}
