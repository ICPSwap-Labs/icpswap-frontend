import { useEffect, useMemo } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { Box, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import { Trans } from "@lingui/macro";
import { isDarkTheme } from "utils/index";
import { Theme } from "@mui/material/styles";
import { useICPPrice , useICPPriceList, useICPBlocksManager } from "store/global/hooks";
import defaultChartConfig from "./chart.config";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    // color: theme.palette.mode === "dark" ? theme.textDark : theme.lightDark,
    "& .apexcharts-tooltip": {
      borderRadius: "12px",
      lineHeight: "26px",
      padding: "8px 16px",
      border: "none",
      background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%) !important",
      "& .apexcharts-tooltip-title": {
        background: "transparent !important",
        border: "none!important",
        padding: 0,
        margin: 0,
        color: "#fff",
      },
      "& .apexcharts-tooltip-text": {
        color: "#fff",
      },
      "& .apexcharts-tooltip-series-group": {
        padding: 0,
        margin: 0,
      },
    },
  },
  fontStyle: {
    fontWeight: 400,
  },
}));

export default function ICPPriceChart() {
  const classes = useStyles();
  const theme = useTheme() as Theme;

  const ICPPrice = useICPPrice();
  const ICPPriceList = useICPPriceList();

  const icpToCycles = ICPPriceList && ICPPriceList.length && ICPPriceList[ICPPriceList.length - 1].xdr;

  const orangeDark = theme.palette.secondary[800];

  const chartConfig = useMemo(() => {
    return {
      ...defaultChartConfig,
      series: [
        {
          data: ICPPriceList.map((item) => ({
            y: item.usd,
            x: item.timestamp,
          })),
        },
      ],
    };
  }, [defaultChartConfig, ICPPriceList]);

  useEffect(() => {
    const newSupportChart = {
      ...chartConfig.options,
      colors: [orangeDark],
      tooltip: {
        theme: isDarkTheme(theme) ? "dark" : "light",
      },
    };

    ApexCharts.exec(`support-chart`, "updateOptions", newSupportChart);
  }, [theme, orangeDark, ICPPriceList]);

  const { blocks, secondBlocks } = useICPBlocksManager();

  return (
    <Box className={classes.card}>
      <Typography color="text.primary" sx={{ fontSize: "30px", fontWeight: 500 }}>
        {ICPPrice ? `$${ICPPrice.toFixed(2)}` : "--"}
        <Typography component="span">(1 ICP = {icpToCycles || "--"} T Cycles)</Typography>

        <Typography component="span" sx={{ margin: "0 0 0 40px" }}>
          <Trans>Data From ICP Price Oracle</Trans>
        </Typography>
      </Typography>

      {/* @ts-ignore */}
      <Chart {...chartConfig} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "32px",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography>Blocks: {blocks ? new BigNumber(blocks).toFormat() : "--"}</Typography>
        <Typography>Blocks/second: {secondBlocks ? new BigNumber(secondBlocks).toFixed(2) : "--"}</Typography>
      </Box>
    </Box>
  );
}
