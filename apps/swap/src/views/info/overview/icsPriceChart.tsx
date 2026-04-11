import { useTokenCharts } from "@icpswap/hooks";
import { ICS } from "@icpswap/tokens";
import { BigNumber, formatDollarAmount, toUnixTimestamp } from "@icpswap/utils";
import { echarts } from "components/echarts";
import { Box, useTheme } from "components/Mui";
import dayjs from "dayjs";
import type { ECharts } from "echarts/core";
import { useMediaQueryMD } from "hooks/theme";
import { useEffect, useMemo, useRef, useState } from "react";

const CHART_HEIGHT_MD = 350;
const CHART_HEIGHT_UP = 290;

const LINE_COLOR = "#5669DC";
const AXIS_LABEL_COLOR = "#8492C4";

export function ICSPriceChart() {
  const theme = useTheme();
  const matchDownMD = useMediaQueryMD();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  const prevSeriesSigRef = useRef<string>("");
  const [echartsReady, setEchartsReady] = useState(false);

  const { data: result, isPending } = useTokenCharts({ tokenId: ICS.address, level: "d1", page: 1, limit: 30 });

  const chartData = useMemo(() => {
    if (!result?.content) return undefined;
    return [...result.content].reverse();
  }, [result]);

  const seriesData = useMemo(() => {
    if (!chartData?.length) return [];
    const slice = chartData.slice(chartData.length > 30 ? chartData.length - 30 : 0, chartData.length);
    return slice.map((item) => [toUnixTimestamp(item.beginTime) * 1000, Number(item.close)] as [number, number]);
  }, [chartData]);

  const height = matchDownMD ? CHART_HEIGHT_MD : CHART_HEIGHT_UP;

  useEffect(() => {
    const onResize = () => chartRef.current?.resize();
    window.addEventListener("resize", onResize);
    const el = containerRef.current;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            chartRef.current?.resize();
          })
        : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!seriesData.length) {
      prevSeriesSigRef.current = "";
      chartRef.current?.dispose();
      chartRef.current = null;
      setEchartsReady(false);
      return;
    }

    const sig = JSON.stringify(seriesData);
    const seriesChanged = prevSeriesSigRef.current !== sig;
    if (seriesChanged) {
      prevSeriesSigRef.current = sig;
      setEchartsReady(false);
    }

    let disposed = false;

    (async () => {
      if (disposed || !containerRef.current) return;

      if (!chartRef.current) {
        chartRef.current = echarts.init(containerRef.current, undefined, { renderer: "canvas" });
      }

      chartRef.current.setOption(
        {
          backgroundColor: "transparent",
          grid: {
            left: 4,
            right: 8,
            top: 12,
            bottom: 4,
            containLabel: true,
          },
          xAxis: {
            type: "time",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              color: AXIS_LABEL_COLOR,
              fontSize: 12,
              fontFamily: "'Poppins','Roboto',sans-serif",
              fontWeight: 400,
              formatter: (value: number) => dayjs(value).format("MM.DD h:mm A"),
            },
            splitLine: { show: false },
          },
          yAxis: {
            type: "value",
            position: "right",
            scale: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              color: AXIS_LABEL_COLOR,
              fontSize: 12,
              fontFamily: "'Poppins','Roboto',sans-serif",
              fontWeight: 400,
              formatter: (value: number) => new BigNumber(value).toFormat(6),
            },
            splitLine: { show: false },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
              lineStyle: { color: LINE_COLOR, opacity: 0.5 },
            },
            backgroundColor: theme.palette.background.level1,
            borderWidth: 0,
            borderRadius: 12,
            padding: [8, 16],
            textStyle: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "'Poppins','Roboto',sans-serif",
            },
            formatter: (params: unknown) => {
              const arr = params as Array<{ value: [number, number] }>;
              const p = arr[0];
              if (!p?.value) return "";
              const t = dayjs(p.value[0]).format("MM/DD/YYYY h:mm");
              const v = formatDollarAmount(p.value[1]);
              return `${t}<br/>${v}`;
            },
          },
          series: [
            {
              type: "line",
              smooth: true,
              showSymbol: false,
              lineStyle: { width: 3, color: LINE_COLOR },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(86, 105, 220, 0.5)" },
                    { offset: 1, color: "rgba(17, 25, 54, 0)" },
                  ],
                },
              },
              data: seriesData,
            },
          ],
        },
        { notMerge: true },
      );

      if (disposed) return;

      chartRef.current?.resize();
      setEchartsReady(true);
    })();

    return () => {
      disposed = true;
    };
  }, [seriesData, theme.palette.background.level1]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  const showLoadingOverlay = isPending || (seriesData.length > 0 && !echartsReady);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          display: showLoadingOverlay ? "block" : "none",
          width: "100%",
          height: matchDownMD ? "100%" : "290px",
          background: theme.palette.background.level3,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      <Box ref={containerRef} sx={{ width: "100%", height }} />
    </Box>
  );
}
