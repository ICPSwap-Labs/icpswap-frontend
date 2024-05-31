import React, { useRef, useState, useEffect, useCallback, Dispatch, SetStateAction, ReactNode } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { GridRowBetween } from "../Grid/Row";

dayjs.extend(utc);

const DEFAULT_HEIGHT = 300;

export type CandleChartProps = {
  data: any[];
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>>; // used for value label on hover
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
  onHoverChange?: (data: any) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const CandleChart = ({
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
  onHoverChange,
  ...rest
}: CandleChartProps) => {
  const theme = useTheme() as Theme;

  const textColor = theme.palette.text.secondary;
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();

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
        width: chartRef.current.parentElement.clientWidth - 32,
        layout: {
          backgroundColor: "transparent",
          textColor,
          fontFamily: "Inter var",
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          secondsVisible: true,
          tickMarkFormatter: (unixTime: number) => {
            return dayjs.unix(unixTime).format("MM/DD h:mm A");
          },
        },
        watermark: {
          visible: false,
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
          mode: 1,
          vertLine: {
            visible: true,
            labelVisible: false,
            style: 3,
            width: 1,
            color: textColor,
            labelBackgroundColor: color,
          },
        },
      });

      chart.timeScale().fitContent();
      chart.timeScale().applyOptions({
        barSpacing: 20,
      });

      setChart(chart);
    }
  }, [color, chartCreated, data, height, setValue, textColor, theme]);

  useEffect(() => {
    if (chartCreated && data) {
      const series = chartCreated.addCandlestickSeries({
        upColor: "green",
        downColor: "red",
        borderDownColor: "red",
        borderUpColor: "green",
        wickDownColor: "red",
        wickUpColor: "green",
      });

      series.setData(data);

      const lastOpen = data[data.length - 1] ? data[data.length - 1].open : undefined;

      const precision = lastOpen ? (lastOpen < 0.000001 ? 8 : lastOpen < 0.0001 ? 6 : lastOpen < 0.001 ? 4 : 3) : 2;

      series.applyOptions({
        priceFormat: {
          type: "price",
          precision,
          minMove: 1 / 10 ** precision,
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
          // reset values
          if (setValue) setValue(undefined);
          if (setLabel) setLabel(undefined);
          if (onHoverChange) onHoverChange(undefined);
        } else if (series && param) {
          const timestamp = param.time as number;
          const time = dayjs.unix(timestamp).format("MMM D, YYYY h:mm A");
          const parsed = param.seriesPrices.get(series) as { open: number } | undefined;
          if (setValue) setValue(parsed?.open);
          if (setLabel) setLabel(time);
          if (onHoverChange) onHoverChange(parsed);
        }
      });
    }
  }, [chartCreated, color, data, height, setValue, setLabel]);

  return (
    <Box
      sx={{
        width: "100%",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        minHeight,
        " > *": {
          fontSize: "1rem",
        },
      }}
    >
      <GridRowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </GridRowBetween>
      <div ref={chartRef} id="candle-chart" {...rest} />
      <GridRowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </GridRowBetween>
    </Box>
  );
};
