import { useState, useEffect, useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Trans, t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { InfoWrapper } from "components/index";
import { useSwapProtocolData, useTransformedVolumeData } from "@icpswap/hooks";
import {
  GridAutoRows,
  MainCard,
  BarChartAlt,
  LineChartAlt,
  Tooltip,
  ChartDateButtons,
  ImageLoading,
  Flex,
} from "@icpswap/ui";
import dayjs from "dayjs";
import { useChartData } from "hooks/info/useSwapChartData";
import { VolumeWindow } from "@icpswap/types";

import Transactions from "./Transactions";
import TopPools from "./TopPools";
import TopTokens from "./TopTokens";

export default function SwapOverview() {
  const { result: protocolData } = useSwapProtocolData();
  const protocolChart = useChartData();
  const theme = useTheme();

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

  return (
    <InfoWrapper>
      <GridAutoRows gap="20px">
        <Flex fullWidth>
          <Typography sx={{ color: theme.colors.darkPrimary400 }} fontSize="16px" fontWeight="500">
            <Trans>Swap Overview V3</Trans>
          </Typography>
        </Flex>

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
            level={3}
          >
            {formattedTvlData ? null : (
              <Box sx={{ width: "100%", height: "332px" }}>
                <ImageLoading loading={!formattedTvlData} />
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
                      {formatDollarAmount(liquidityHover)}
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
            level={3}
          >
            {!formattedVolumeData ? (
              <Box sx={{ width: "100%", height: "332px" }}>
                <ImageLoading loading={!formattedVolumeData} />
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
                          ? formatDollarAmount(protocolData.volumeUSD)
                          : ""
                        : formatDollarAmount(volumeHover)}
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
        </Box>

        <TopTokens />

        <TopPools />

        <Transactions />
      </GridAutoRows>
    </InfoWrapper>
  );
}
