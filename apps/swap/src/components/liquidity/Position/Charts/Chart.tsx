import { max, scaleLinear, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "components/Mui";
import { PriceLine, Area, AxisBottom } from "components/liquidity/Charts/index";
import Zoom, { ZoomOverlay } from "components/liquidity/PriceRangeChart/Zoom";
import { ChartEntry, ZoomLevels, Dimensions, Margins } from "components/liquidity/PriceRangeChart/types";
import type { Null } from "@icpswap/types";
import { Bound } from "constants/swap";
import { nonUndefinedOrNull } from "@icpswap/utils";

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
  styles: {
    area: {
      // color of the ticks in range
      selection: string;
      leftColor: string;
      rightColor: string;
    };
  };
  dimensions: Dimensions;
  margins: Margins;
  zoomLevels: ZoomLevels;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  poolPriceLower: string | number | Null;
  poolPriceUpper: string | number | Null;
}

export function Chart({
  id = "liquidityPositionChart",
  data: { series, current, lower, upper },
  dimensions: { width, height },
  margins,
  zoomLevels,
  poolPriceLower,
  poolPriceUpper,
  styles,
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
      const newXScale = zoom.rescaleX(scales.xScale);
      scales.xScale.domain(newXScale.domain());
    }

    return scales;
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, innerWidth, series, innerHeight, zoom]);

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null);
  }, [zoomLevels]);

  const areaLower = lower;
  const areaUpper = upper;

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
        zoomLevels={zoomLevels}
        noIcons
      />

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`${id}-range-area`} x1="0%" y1="100%" x2="100%" y2="100%">
            <stop stopColor={styles.area.leftColor} offset="0%" />
            <stop stopColor={styles.area.rightColor} offset="100%" />
          </linearGradient>

          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {nonUndefinedOrNull(areaLower) && nonUndefinedOrNull(areaUpper) && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect
                fill={`url(#${id}-range-area`}
                x={xScale(Number(areaLower))}
                y="0"
                width={xScale(Number(areaUpper)) - xScale(Number(areaLower))}
                height={innerHeight}
                fillOpacity={0.5}
              />
            </mask>
          )}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area series={series} xScale={xScale} yScale={yScale} xValue={xAccessor} yValue={yAccessor} />

            {nonUndefinedOrNull(areaLower) && nonUndefinedOrNull(areaUpper) && (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <rect
                  fill={`url(#${id}-range-area`}
                  x={xScale(Number(areaLower))}
                  y={0}
                  width={xScale(Number(areaUpper)) - xScale(Number(areaLower))}
                  height={innerHeight}
                  fillOpacity={0.5}
                />
              </g>
            )}

            <PriceLine value={current} xScale={xScale} height={innerHeight} />

            {poolPriceLower ? (
              <PriceLine
                id="lower"
                value={Number(poolPriceLower)}
                xScale={xScale}
                height={innerHeight}
                color={theme.colors.primaryMain}
              />
            ) : null}

            {poolPriceUpper ? (
              <PriceLine
                id="upper"
                value={Number(poolPriceUpper)}
                xScale={xScale}
                height={innerHeight}
                color={theme.colors.primaryMain}
              />
            ) : null}

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <ZoomOverlay width={innerWidth} height={height} ref={zoomRef} />
        </g>
      </svg>
    </>
  );
}
