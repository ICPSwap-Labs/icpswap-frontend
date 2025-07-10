import { max, scaleLinear, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "components/Mui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import {
  PriceLine,
  Area,
  AxisBottom,
  ChartEntry,
  LiquidityChartRangeInputProps,
} from "components/liquidity/Charts/index";
import { Brush } from "components/liquidity/PriceRangeChart/Brush";
import Zoom, { ZoomOverlay } from "components/liquidity/PriceRangeChart/Zoom";

export const xAccessor = (d: ChartEntry) => d.price0;
export const yAccessor = (d: ChartEntry) => d.activeLiquidity;

export function Chart({
  id = "liquidityChartRangeInput",
  data: { series, current },
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brushDomain,
  brushLabels,
  onBrushDomainChange,
  zoomLevels,
  poolPriceLower,
  poolPriceUpper,
  defaultPriceRange,
}: LiquidityChartRangeInputProps) {
  const theme = useTheme();
  const zoomRef = useRef<SVGRectElement | null>(null);

  const [zoom, setZoom] = useState<ZoomTransform | null>(null);

  const [innerHeight, innerWidth] = useMemo(
    () => [height - margins.top - margins.bottom, width - margins.left - margins.right],
    [width, height, margins],
  );

  const defaultDomain: [number, number] = useMemo(() => {
    return nonUndefinedOrNull(defaultPriceRange)
      ? [Number(defaultPriceRange.min), Number(defaultPriceRange.max)]
      : [current * zoomLevels.initialMin, current * zoomLevels.initialMax];
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, defaultPriceRange]);

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear().domain(defaultDomain).range([0, innerWidth]),
      yScale: scaleLinear()
        .domain([0, max(series, yAccessor)] as number[])
        .range([innerHeight, 0]),
    };

    if (zoom) {
      const newXscale = zoom.rescaleX(scales.xScale);
      scales.xScale.domain(newXscale.domain());
    }

    return scales;
  }, [defaultDomain, innerWidth, series, innerHeight, zoom]);

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null);
  }, [zoomLevels]);

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange(xScale.domain() as [number, number], undefined);
    }
  }, [brushDomain, onBrushDomainChange, xScale]);

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
          onBrushDomainChange(defaultDomain, "reset");
        }}
        zoomLevels={zoomLevels}
      />

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {brushDomain && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect
                fill="white"
                x={xScale(brushDomain[0])}
                y="0"
                width={xScale(brushDomain[1]) - xScale(brushDomain[0])}
                height={innerHeight}
              />
            </mask>
          )}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area series={series} xScale={xScale} yScale={yScale} xValue={xAccessor} yValue={yAccessor} />

            {brushDomain && (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <Area
                  series={series}
                  xScale={xScale}
                  yScale={yScale}
                  xValue={xAccessor}
                  yValue={yAccessor}
                  fill={styles.area.selection}
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

          <Brush
            id={id}
            xScale={xScale}
            interactive={interactive}
            brushLabelValue={brushLabels}
            brushExtent={brushDomain ?? (xScale.domain() as [number, number])}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            setBrushExtent={onBrushDomainChange}
            westHandleColor={styles.brush.handle.west}
            eastHandleColor={styles.brush.handle.east}
          />
        </g>
      </svg>
    </>
  );
}
