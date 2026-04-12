import dayjs from "dayjs";
import type { EChartsType } from "echarts/core";
import { darken } from "polished";
import type React from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useRef } from "react";

import { echarts } from "../../echarts";
import { GridRowBetween } from "../Grid/Row";
import { Box, useTheme } from "../Mui";

export type LineChartAltProps = {
  data: Array<{ time: number; value: number | string }>;
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>;
  setLabel?: Dispatch<SetStateAction<string | undefined>>;
  value?: number;
  label?: string;
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
  tickFormat?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xTickFormatter?: (val: string) => string;
  yTickFormatter?: (val: string) => string;
  tipFormat?: string;
  /** Horizontal reference line (replaces Recharts ReferenceLine + extraNode). */
  markLine?: {
    y: number | string;
    color?: string;
    labelText: string;
  };
  showTooltip?: boolean;
  showTooltipContent?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function LineChartAlt({
  data,
  color = "#5669dc",
  setValue,
  setLabel,
  value: _value,
  label: _label,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = 300,
  tickFormat = "DD",
  showXAxis = true,
  showYAxis = false,
  xTickFormatter,
  yTickFormatter,
  tipFormat = "MMM D, YYYY",
  markLine,
  height,
  showTooltip = true,
  showTooltipContent = false,
  ...rest
}: LineChartAltProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!data?.length || !containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, undefined, { renderer: "canvas" });
    }

    const chart = chartRef.current;
    const categories = data.map((d) => d.time);
    const values = data.map((d) => Number(d.value));

    const gradientTop = darken(0.36, color);
    const markLineOpt =
      markLine !== undefined
        ? {
            silent: true,
            symbol: "none",
            lineStyle: {
              color: markLine.color ?? theme.colors.apr,
              width: 1,
              type: "dashed" as const,
            },
            data: [
              {
                yAxis: typeof markLine.y === "string" ? Number(markLine.y) : markLine.y,
                label: {
                  show: true,
                  formatter: markLine.labelText,
                  color: theme.palette.text.primary,
                  fontSize: 12,
                },
              },
            ],
          }
        : undefined;

    chart.setOption(
      {
        animation: false,
        grid: {
          left: 4,
          right: 4,
          top: 4,
          bottom: showXAxis ? 28 : 4,
          containLabel: showYAxis,
        },
        xAxis: {
          type: "category",
          data: categories,
          show: showXAxis,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: showXAxis
            ? {
                color: theme.palette.text.secondary,
                fontSize: 12,
                formatter: (val: string) => (xTickFormatter ? xTickFormatter(val) : dayjs(val).format(tickFormat)),
              }
            : { show: false },
        },
        yAxis: {
          type: "value",
          show: showYAxis,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: showYAxis
            ? {
                color: theme.palette.text.secondary,
                fontSize: 12,
                formatter: (v: number) => (yTickFormatter ? yTickFormatter(String(v)) : String(v)),
              }
            : { show: false },
          splitLine: { show: false },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line", lineStyle: { color: "#8572FF", width: 1 } },
          show: showTooltip,
          showContent: showTooltipContent,
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
        },
        series: [
          {
            type: "line",
            smooth: true,
            symbolSize: 10,
            showSymbol: false,
            symbol: "emptyCircle",
            lineStyle: { width: 2, color },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0.05, color: `${gradientTop}80` },
                  { offset: 1, color: `${color}00` },
                ],
              },
            },
            data: values,
            markLine: markLineOpt,
          },
        ],
      },
      { notMerge: true },
    );

    const onLeave = () => {
      if (setLabel) setLabel(undefined);
      if (setValue) setValue(undefined);
    };

    const onMove = (event) => {
      const pointInPixel = [event.offsetX, event.offsetY];
      const [xIndex] = chart.convertFromPixel({ gridIndex: 0, seriesIndex: 0 }, pointInPixel);

      const row = data[xIndex];

      if (row) {
        const numVal = Number(row.value);
        if (setValue) setValue(numVal);
        const formattedTime = dayjs(row.time).format(tipFormat);
        if (setLabel) setLabel(formattedTime);
      }
    };

    chart.getZr().on("globalout", onLeave);
    chart.getZr().on("mousemove", onMove);

    return () => {
      chart.getZr().off("globalout", onLeave);
      chart.getZr().off("mousemove", onMove);
    };
  }, [
    data,
    color,
    showXAxis,
    showYAxis,
    tickFormat,
    tipFormat,
    xTickFormatter,
    yTickFormatter,
    theme.palette.text.secondary,
    theme.palette.text.primary,
    theme.colors.apr,
    markLine,
    setValue,
    setLabel,
    showTooltip,
    showTooltipContent,
  ]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ro =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(() => chartRef.current?.resize())
        : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);
    return () => ro?.disconnect();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: `${minHeight}px`,
        display: "flex",
        minHeight,
        flexDirection: "column",
        "> *": {
          fontSize: "1rem",
        },
      }}
      {...rest}
    >
      <GridRowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </GridRowBetween>

      <Box ref={containerRef} sx={{ width: "100%", flex: 1, minHeight: height ?? minHeight - 40 }} />

      <GridRowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </GridRowBetween>
    </Box>
  );
}
