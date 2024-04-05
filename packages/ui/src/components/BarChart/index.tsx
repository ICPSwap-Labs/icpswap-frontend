import React, { useRef, useState, useEffect, useCallback, Dispatch, SetStateAction, ReactNode } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { usePrevious } from "@icpswap/hooks";
import { formatDollarAmount } from "@icpswap/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { GridRowBetween } from "../Grid/Row";

dayjs.extend(utc);

const DEFAULT_HEIGHT = 300;

export type BarChartProps = {
  data: any[];
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>>; // used for label of valye
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export function BarChart({
  data,
  color = "#56B2A4",
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  height = DEFAULT_HEIGHT,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: BarChartProps) {
  const theme = useTheme() as Theme;
  const textColor = "#fff";
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();

  const dataPrev = usePrevious(data);

  // reset on new data
  useEffect(() => {
    if (dataPrev !== data && chartCreated) {
      chartCreated.resize(0, 0);
      setChart(undefined);
    }
  }, [data, dataPrev, chartCreated]);

  // for reseting value on hover exit
  const currentValue = data[data.length - 1]?.value;

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, height);
      chartCreated.timeScale().fitContent();
      chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, chartRef, height]);

  // add event listener for resize
  const isClient = typeof window === "object";
  useEffect(() => {
    if (!isClient) {
      return;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, chartRef, handleResize]); // Empty array ensures that effect is only run on mount and unmount

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartCreated && data && !!chartRef?.current?.parentElement) {
      const chart = createChart(chartRef.current, {
        height,
        width: chartRef.current.parentElement.clientWidth - 62,
        layout: {
          backgroundColor: "transparent",
          textColor: "#565A69",
          fontFamily: "Inter var",
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0,
          },

          drawTicks: false,
          borderVisible: false,
          visible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        watermark: {
          color: "rgba(0, 0, 0, 0)",
        },
        grid: {
          horzLines: {
            visible: false,
          },
          vertLines: {
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 3,
            width: 1,
            color: "#505050",
            labelBackgroundColor: color,
            labelVisible: false,
          },
        },
      });

      chart.timeScale().fitContent();
      setChart(chart);
    }
  }, [color, chartCreated, currentValue, data, height, setValue, textColor, theme]);

  useEffect(() => {
    if (chartCreated && data) {
      const series = chartCreated.addHistogramSeries({
        color,
      });

      series.setData(data);
      chartCreated.timeScale().fitContent();

      series.applyOptions({
        priceFormat: {
          type: "custom",
          minMove: 0.02,
          formatter: (price: any) => formatDollarAmount(price),
        },
      });

      // update the title when hovering on the chart
      chartCreated.subscribeCrosshairMove((param) => {
        if (
          chartRef?.current &&
          (param === undefined ||
            param.time === undefined ||
            (param && param.point && param.point.x < 0) ||
            (param && param.point && param.point.x > chartRef.current.clientWidth) ||
            (param && param.point && param.point.y < 0) ||
            (param && param.point && param.point.y > height))
        ) {
          if (setValue) setValue(undefined);
          if (setLabel) setLabel(undefined);
        } else if (series && param) {
          const time = param?.time as { day: number; year: number; month: number };
          const timeString = dayjs(`${time.year}-${time.month}-${time.day}`).format("MMM D, YYYY");
          const price = parseFloat(param?.seriesPrices?.get(series)?.toString() ?? currentValue);
          if (setValue) setValue(price);
          if (setLabel && timeString) setLabel(timeString);
        }
      });
    }
  }, [chartCreated, color, currentValue, data, height, setLabel, setValue]);

  return (
    <Box
      sx={{
        width: "100%",
        padding: "1rem",
        paddingRight: "2rem",
        display: "flex",
        // backgroundColor: ${({ theme }) => theme.bg0}
        flexDirection: "column",
        minHeight,
        "> * ": {
          fontSize: "1rem",
        },
      }}
    >
      <GridRowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </GridRowBetween>
      <div ref={chartRef} id="bar-chart" {...rest} />
      <GridRowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </GridRowBetween>
    </Box>
  );
}
