import { useState, useEffect, ReactNode, useMemo } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import Wrapper from "ui-component/Wrapper";
import { Trans } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { MainCard } from "ui-component/index";
import { useGraphSwapProtocolData, useGraphSwapProtocolChart } from "hooks/v2";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import LineChart from "ui-component/LineChart/alt";
import BarChart from "ui-component/BarChart/alt";
import { GridAutoRows } from "ui-component/Grid/index";
import TopTokens from "./TopTokens";
import TopPools from "./TopPools";
import dayjs from "dayjs";
import SwapAnalyticLoading from "ui-component/analytic-v2/Loading";
import { useHistory } from "react-router-dom";

export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}

function LinkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.4367 2.42969H1.15951V0.429688H8.85528H9.85528V1.42969V9.12545H7.85528V3.83954L1.9396 9.75521L0.525391 8.341L6.4367 2.42969Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function SmallOptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode | ReactNode[];
  onClick: () => void;
}) {
  const theme = useTheme() as Theme;

  return (
    <Typography
      onClick={onClick}
      color="text.primary"
      component="div"
      sx={{
        padding: "4px",
        minWidth: "36px",
        fontSize: "12px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        background: active ? theme.colors.darkSecondaryDark : theme.palette.background.level3,
        cursor: "pointer",
      }}
    >
      {children}
    </Typography>
  );
}

export default function SwapOverview() {
  const { result: protocolData } = useGraphSwapProtocolData();
  const { result: protocolChart, loading: chartDataLoading } = useGraphSwapProtocolChart(0, 1000);

  const [volumeHover, setVolumeHover] = useState<number | undefined>();
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>();
  const [leftLabel, setLeftLabel] = useState<string | undefined>();
  const [rightLabel, setRightLabel] = useState<string | undefined>();

  //if hover value undefined, reset to current day value
  useEffect(() => {
    if (volumeHover === undefined && protocolData) {
      setVolumeHover(protocolData.volumeUSD);
    }
  }, [protocolData, volumeHover]);

  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
      setLiquidityHover(protocolData.tvlUSD);
    }
  }, [liquidityHover, protocolData]);

  const formattedVolumeData = useMemo(() => {
    if (!protocolChart) return [];

    return protocolChart.map((data) => ({
      time: dayjs(Number(data.timestamp) * 1000).format("YYYY-MM-DD"),
      value: data.volumeUSD,
    }));
  }, [protocolChart]);

  const formattedTvlData = useMemo(() => {
    if (!protocolChart) return [];

    return protocolChart.map((data) => ({
      time: dayjs(Number(data.timestamp) * 1000).format("YYYY-MM-DD"),
      value: data.tvlUSD,
    }));
  }, [protocolChart]);

  const [volumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const monthlyVolumeData = formattedVolumeData;
  const weeklyVolumeData = formattedVolumeData;

  const history = useHistory();

  const handleToSwapV3 = () => {
    history.push("/swap");
  };

  return (
    <Wrapper>
      <GridAutoRows gap="20px">
        <Grid container alignItems="center">
          <Typography color="text.primary" fontSize="20px" fontWeight="500">
            <Trans>Swap Overview V2</Trans>
          </Typography>

          <Grid item xs>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleToSwapV3}
                sx={{
                  background: "#5669DC",
                }}
              >
                Swap V3
                <Box component="span" sx={{ margin: "0 0 0 4px" }}>
                  <LinkIcon />
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Box
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
            border={false}
          >
            <SwapAnalyticLoading loading={chartDataLoading} />

            <LineChart
              data={formattedTvlData}
              height={220}
              minHeight={332}
              value={liquidityHover}
              label={leftLabel}
              setValue={setLiquidityHover}
              setLabel={setLeftLabel}
              topLeft={
                <GridAutoRows gap="4px">
                  <Typography fontSize="16px">TVL</Typography>
                  <Typography fontSize="32px" fontWeight="500" color="text.primary">
                    {formatDollarAmount(liquidityHover, 2, true)}
                  </Typography>
                  <Typography fontSize="12px" sx={{ height: "14px" }}>
                    {leftLabel ? leftLabel : null}
                  </Typography>
                </GridAutoRows>
              }
            />
          </MainCard>

          <MainCard
            sx={{
              position: "relative",
              width: "100%",
            }}
            level={2}
            border={false}
          >
            <SwapAnalyticLoading loading={chartDataLoading} />

            <BarChart
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
              activeWindow={volumeWindow}
              // topRight={
              //   <Box
              //     sx={{
              //       marginLeft: "-40px",
              //       marginTop: "8px",
              //       display: "grid",
              //       columnGap: "8px",
              //       gridTemplateColumns: "repeat(3, 1fr)",
              //     }}
              //   >
              //     <SmallOptionButton
              //       active={volumeWindow === VolumeWindow.daily}
              //       onClick={() => setVolumeWindow(VolumeWindow.daily)}
              //     >
              //       D
              //     </SmallOptionButton>
              //     <SmallOptionButton
              //       active={volumeWindow === VolumeWindow.weekly}
              //       onClick={() => setVolumeWindow(VolumeWindow.weekly)}
              //     >
              //       W
              //     </SmallOptionButton>
              //     <SmallOptionButton
              //       active={volumeWindow === VolumeWindow.monthly}
              //       onClick={() => setVolumeWindow(VolumeWindow.monthly)}
              //     >
              //       M
              //     </SmallOptionButton>
              //   </Box>
              // }
              topLeft={
                <GridAutoRows gap="4px">
                  <Typography fontSize="16px">Volume 24H</Typography>
                  <Typography color="text.primary" fontWeight={500} fontSize="32px">
                    {formatDollarAmount(volumeHover, 2)}
                  </Typography>
                  <Typography fontSize="12px" height="14px">
                    {rightLabel ? rightLabel : null}
                  </Typography>
                </GridAutoRows>
              }
            />
          </MainCard>
        </Box>

        <MainCard level={2} border={false}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "fit-content(100%) fit-content(100%) fit-content(100%)",
              gap: "0 18px",

              "@media screen and (max-width: 720px)": {
                "& > *:nth-of-type(2)": {
                  display: "none",
                },
              },

              "@media screen and (max-width: 540px)": {
                "& > *:nth-of-type(2)": {
                  display: "flex",
                },
                gridTemplateColumns: "1fr",
                gap: "8px 0",
              },
            }}
          >
            <Grid container alignItems="center">
              <Typography sx={{ marginRight: "4px" }}>
                <Trans>Today(UTC):</Trans>
              </Typography>

              <Typography color="text.primary" sx={{ marginRight: "4px" }}>
                {protocolData?.volumeUSD ? formatDollarAmount(protocolData?.volumeUSD) : "--"}
              </Typography>
            </Grid>

            <Grid container alignItems="center">
              <Typography sx={{ marginRight: "4px" }}>
                <Trans>Fees 24H:</Trans>
              </Typography>

              <Typography color="text.primary" sx={{ marginRight: "4px" }}>
                {protocolData?.volumeUSD ? formatDollarAmount(protocolData?.feesUSD) : "--"}
              </Typography>
            </Grid>

            <Grid container alignItems="center">
              <Typography sx={{ marginRight: "4px" }}>
                <Trans>TVL:</Trans>
              </Typography>

              <Typography color="text.primary" sx={{ marginRight: "4px" }}>
                {protocolData?.volumeUSD ? formatDollarAmount(protocolData?.tvlUSD) : "--"}
              </Typography>
            </Grid>
          </Box>
        </MainCard>

        <TopTokens />

        <TopPools />

        <Box />
      </GridAutoRows>
    </Wrapper>
  );
}
