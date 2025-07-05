import { useEffect, useMemo, useState } from "react";
import { makeStyles, useTheme, Box, Theme, useMediaQuery } from "components/Mui";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import { useTokenCharts } from "@icpswap/hooks";
import { ICS } from "@icpswap/tokens";
import { toUnixTimestamp } from "@icpswap/utils";

import defaultChartConfig from "./chart.config";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: "relative",
    "& .apexcharts-tooltip": {
      borderRadius: "12px",
      lineHeight: "26px",
      padding: "8px 16px",
      border: "none",
      background: `${theme.palette.background.level1}!important`,
      boxShadow: "none!important",
      "& .apexcharts-tooltip-title": {
        background: "transparent !important",
        border: "none!important",
        padding: 0,
        margin: 0,
        color: "#fff",
        fontFamily: "'Poppins','Roboto',sans-serif",
      },
      "& .apexcharts-tooltip-text": {
        padding: 0,
        margin: 0,
        color: "#fff",
        fontFamily: "'Poppins','Roboto',sans-serif",
      },
      "& .apexcharts-tooltip-series-group": {
        padding: 0,
        margin: 0,
      },

      // #4F5A84
    },
    "& .apexcharts-xaxis-label": {
      transform: "rotate(0deg)!important",
      color: `${theme.colors.darkTextSecondary}!important`,
      fill: `${theme.colors.darkTextSecondary}!important`,
    },
  },
  fontStyle: {
    fontWeight: 400,
  },
}));

export function ICSPriceChart() {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);

  const { result } = useTokenCharts({ tokenId: ICS.address, level: "d1", page: 1, limit: 30 });

  const chartData = useMemo(() => {
    return result?.content.reverse();
  }, [result]);

  const chartConfig = useMemo(() => {
    return {
      ...defaultChartConfig,
      height: matchDownMD ? 350 : defaultChartConfig.height,
      series: chartData
        ? [
            {
              data: [...chartData]
                .slice(chartData.length > 30 ? chartData.length - 30 : 0, chartData.length)
                .map((item) => ({
                  y: item.close,
                  x: toUnixTimestamp(item.beginTime),
                })),
            },
          ]
        : [],
    };
  }, [defaultChartConfig, matchDownMD, chartData]);

  useEffect(() => {
    if (chartConfig && chartConfig.series.length > 0) {
      ApexCharts.exec(`support-chart`, "updateOptions", chartConfig.options);
      setLoading(false);
    }
  }, [chartConfig, chartData]);

  return (
    <Box className={classes.card}>
      <Box
        sx={{
          display: loading ? "block" : "none",
          width: "100%",
          height: matchDownMD ? "100%" : "290px",
          background: theme.palette.background.level3,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* @ts-ignore */}
      <Chart {...chartConfig} />
    </Box>
  );
}
