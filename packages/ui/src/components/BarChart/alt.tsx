import dayjs from "dayjs";
import type { EChartsType } from "echarts/core";
import type React from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useRef } from "react";

import { echarts } from "../../echarts";
import { GridRowBetween } from "../Grid/Row";
import { Box, useTheme } from "../Mui";

const DEFAULT_HEIGHT = 300;

export type BarChartAltProps = {
  data: Array<{ time: string; value: number | string }>;
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>;
  setLabel?: Dispatch<SetStateAction<string | undefined>>;
  value?: number;
  label?: string;
  activeWindow?: "daily" | "weekly" | "monthly";
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
  tickFormat?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function BarChartAlt({
  data,
  color = "#5669dc",
  setValue,
  setLabel,
  value,
  label,
  activeWindow,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  tickFormat = "DD",
  height,
  ...rest
}: BarChartAltProps) {
  const theme = useTheme();
  const parsedValue = value;
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

    chart.setOption(
      {
        backgroundColor: "transparent",
        animation: false,
        grid: { left: 20, right: 30, top: 8, bottom: 28, containLabel: false },
        xAxis: {
          type: "category",
          data: categories,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: theme.palette.text.secondary,
            fontSize: 12,
            formatter: (val: string) => dayjs(val).format(activeWindow === "monthly" ? "MMM" : tickFormat),
          },
        },
        yAxis: { type: "value", show: false },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(115, 118, 128, 0.1)",
            },
          },
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          formatter: (params: unknown) => {
            const arr = params as Array<{ dataIndex: number }>;
            const p = arr[0];
            if (!p || p.dataIndex < 0 || p.dataIndex >= data.length) return "";
            const row = data[p.dataIndex];
            const numVal = Number(row.value);
            if (setValue && parsedValue !== numVal) setValue(numVal);

            const now = dayjs();
            const formattedTime = dayjs(row.time).format("MMM D");
            const formattedTimeDaily = dayjs(row.time).format("MMM D YYYY");
            const formattedTimePlusWeek = dayjs(row.time).add(1, "week");
            const formattedTimePlusMonth = dayjs(row.time).add(1, "month");

            if (setLabel && label !== formattedTime) {
              if (activeWindow === "weekly") {
                const isCurrent = formattedTimePlusWeek.isAfter(now);
                setLabel(`${formattedTime}-${isCurrent ? "current" : formattedTimePlusWeek.format("MMM D, YYYY")}`);
              } else if (activeWindow === "monthly") {
                const isCurrent = formattedTimePlusMonth.isAfter(now);
                setLabel(`${formattedTime}-${isCurrent ? "current" : formattedTimePlusMonth.format("MMM D, YYYY")}`);
              } else {
                setLabel(formattedTimeDaily);
              }
            }
            return "";
          },
        },
        series: [
          {
            type: "bar",
            data: values,
            barMaxWidth: 40,
            itemStyle: {
              color,
              borderRadius: [2, 2, 0, 0],
            },
            emphasis: {
              itemStyle: { color, opacity: 0.8 },
            },
          },
        ],
      },
      { notMerge: true },
    );

    const onLeave = () => {
      if (setLabel) setLabel(undefined);
      if (setValue) setValue(undefined);
    };
    chart.getZr().on("globalout", onLeave);

    return () => {
      chart.getZr().off("globalout", onLeave);
    };
  }, [data, color, activeWindow, tickFormat, theme.palette.text.secondary, parsedValue, label, setValue, setLabel]);

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
        display: "flex",
        flexDirection: "column",
        minHeight,
        "> *": {
          fontSize: "1rem",
        },
      }}
      {...rest}
    >
      <GridRowBetween align="flex-start">
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
