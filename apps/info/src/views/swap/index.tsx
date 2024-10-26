import { useState, useEffect, useMemo } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { Wrapper } from "ui-component/index";
import { useSwapProtocolData, useTransformedVolumeData } from "@icpswap/hooks";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { GridAutoRows, MainCard, BarChartAlt, LineChartAlt, Tooltip, ChartDateButtons } from "@icpswap/ui";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import SwapAnalyticLoading from "ui-component/analytic/Loading";
import { useHistory } from "react-router-dom";
import { useChartData } from "hooks/info/useSwapChartData";
import { VolumeWindow } from "@icpswap/types";

import Transactions from "./Transactions";
import TopPools from "./TopPools";
import TopTokens from "./TopTokens";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.30901 7.68584C9.36902 6.12865 9.20946 3.99011 7.82839 2.60904C6.26641 1.04705 3.73366 1.04692 2.17154 2.60904C0.609422 4.17116 0.609552 6.70391 2.17154 8.26589C3.55261 9.64696 5.69115 9.80652 7.24834 8.74651L9.41938 10.9175L10.48 9.85688L8.30901 7.68584ZM6.76773 3.6697C7.74415 4.64611 7.74406 6.2289 6.76773 7.20523C5.7914 8.18156 4.20861 8.18165 3.2322 7.20523C2.25578 6.22882 2.25587 4.64603 3.2322 3.6697C4.20853 2.69337 5.79132 2.69328 6.76773 3.6697Z"
        fill="white"
      />
    </svg>
  );
}

export default function SwapOverview() {
  const { result: protocolData } = useSwapProtocolData();
  const protocolChart = useChartData();
  const theme = useTheme() as Theme;

  const [volumeHover, setVolumeHover] = useState<number | undefined>();
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>();
  const [leftLabel, setLeftLabel] = useState<string | undefined>();
  const [rightLabel, setRightLabel] = useState<string | undefined>();
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
      setLiquidityHover(protocolData.tvlUSD);
    }
  }, [liquidityHover, protocolData]);

  const volumeDayData = useMemo(() => {
    if (!protocolChart) return undefined;

    return protocolChart.reverse().map((data) => ({
      volumeUSD: data.volumeUSD,
      date: Number(data.timestamp),
    }));
  }, [protocolChart]);

  const formattedVolumeData = useMemo(() => {
    if (!volumeDayData) return undefined;

    return volumeDayData.map((ele) => ({
      time: dayjs(ele.date * 1000).format("YYYY-MM-DD"),
      value: ele.volumeUSD,
    }));
  }, [volumeDayData]);

  const formattedTvlData = useMemo(() => {
    if (!protocolChart) return undefined;

    return protocolChart.map((data) => ({
      time: dayjs(Number(data.timestamp) * 1000).format("YYYY-MM-DD"),
      value:
        data.timestamp.toString() === "1686787200"
          ? 3694463
          : data.timestamp.toString() === "1686873600"
          ? 3756323
          : Number(data.timestamp) >= 1690502400 && Number(data.timestamp) <= 1690934400
          ? 1342535
          : data.tvlUSD,
    }));
  }, [protocolChart]);

  const weeklyVolumeData = useTransformedVolumeData(volumeDayData, "week");
  const monthlyVolumeData = useTransformedVolumeData(volumeDayData, "month");

  const history = useHistory();

  const handleToSwapScan = () => {
    history.push("swap-scan/transactions");
  };

  return (
    <Wrapper>
      <GridAutoRows gap="20px">
        <Grid container alignItems="center">
          <Typography sx={{ color: theme.colors.darkPrimary400 }} fontSize="16px" fontWeight="500">
            <Trans>Swap Overview V3</Trans>
          </Typography>

          <Grid item xs>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleToSwapScan}
                sx={{
                  background: "#5669DC",
                }}
              >
                <Box sx={{ display: "flex", gap: "0 4px", alignItems: "center", fontSize: "12px" }}>
                  Swap Scan
                  <SearchIcon />
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 1rem",

            "@media (max-width: 840px)": {
              gridTemplateColumns: "1fr",
              gap: "1rem 0",
            },
          }}
        >
          <MainCard
            sx={{
              position: "relative",
              width: "100%",
            }}
            level={2}
          >
            {formattedTvlData ? null : (
              <Box sx={{ width: "100%", height: "332px" }}>
                <SwapAnalyticLoading loading={!formattedTvlData} />
              </Box>
            )}

            {formattedTvlData ? (
              <LineChartAlt
                data={formattedTvlData}
                height={220}
                minHeight={332}
                value={liquidityHover}
                label={leftLabel}
                setValue={setLiquidityHover}
                setLabel={setLeftLabel}
                topLeft={
                  <GridAutoRows gap="4px">
                    <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                      <Typography fontSize="16px">TVL</Typography>

                      <Tooltip
                        tips={t`TVL is calculated only based on the total value of tokens listed on the Tokenlist.`}
                      />
                    </Box>
                    <Typography fontSize="32px" fontWeight="500" color="text.primary">
                      {formatDollarAmount(liquidityHover, 2, true)}
                    </Typography>
                    <Typography fontSize="12px" sx={{ height: "14px" }}>
                      {leftLabel || null}
                    </Typography>
                  </GridAutoRows>
                }
              />
            ) : null}
          </MainCard>

          <MainCard
            sx={{
              position: "relative",
              width: "100%",
            }}
            level={2}
          >
            {!formattedVolumeData ? (
              <Box sx={{ width: "100%", height: "332px" }}>
                <SwapAnalyticLoading loading={!formattedVolumeData} />
              </Box>
            ) : null}

            {!!volumeDayData && !!formattedVolumeData ? (
              <BarChartAlt
                height={220}
                minHeight={332}
                data={
                  volumeWindow === VolumeWindow.monthly
                    ? monthlyVolumeData
                    : volumeWindow === VolumeWindow.weekly
                    ? weeklyVolumeData
                    : formattedVolumeData
                }
                setValue={setVolumeHover}
                setLabel={setRightLabel}
                value={volumeHover}
                label={rightLabel}
                activeWindow={
                  volumeWindow === VolumeWindow.daily
                    ? "daily"
                    : volumeWindow === VolumeWindow.monthly
                    ? "monthly"
                    : "weekly"
                }
                topRight={
                  <Box
                    sx={{
                      marginLeft: "-40px",
                      marginTop: "8px",
                    }}
                  >
                    <ChartDateButtons volume={volumeWindow} onChange={setVolumeWindow} />
                  </Box>
                }
                topLeft={
                  <GridAutoRows gap="4px">
                    <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                      <Typography fontSize="16px">Volume</Typography>

                      <Tooltip
                        tips={t` Volume is calculated only based on the total value of tokens listed on the Tokenlist.`}
                      />
                    </Box>
                    <Typography color="text.primary" fontWeight={600} fontSize="32px">
                      {volumeHover === undefined
                        ? protocolData
                          ? formatDollarAmount(protocolData.volumeUSD, 2)
                          : ""
                        : formatDollarAmount(volumeHover, 2)}
                    </Typography>
                    {rightLabel || protocolData?.volumeUSD ? (
                      <Typography fontSize="12px" height="14px">
                        {rightLabel || "The last 24H"}
                      </Typography>
                    ) : null}
                  </GridAutoRows>
                }
              />
            ) : null}
          </MainCard>
        </Box> */}

        <TopTokens />

        <TopPools />

        <Transactions />
      </GridAutoRows>
    </Wrapper>
  );
}
