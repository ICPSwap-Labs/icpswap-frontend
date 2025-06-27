import { useState, useMemo } from "react";
import { Typography, Box } from "components/Mui";
import { formatDollarAmount } from "@icpswap/utils";
import { useTransformedVolumeData } from "@icpswap/hooks";
import { GridAutoRows, MainCard, BarChartAlt, Tooltip, ChartDateButtons, ImageLoading } from "@icpswap/ui";
import dayjs from "dayjs";
import {
  ApiResult,
  InfoGlobalDataResponse,
  InfoGlobalRealTimeDataResponse,
  Null,
  PageResponse,
  VolumeWindow,
} from "@icpswap/types";
import { useTranslation } from "react-i18next";

interface VolumeChartsWrapperProps {
  globalProtocol: InfoGlobalRealTimeDataResponse | Null;
  globalCharts: ApiResult<PageResponse<InfoGlobalDataResponse>> | Null;
}

export function VolumeChartsWrapper({ globalCharts, globalProtocol }: VolumeChartsWrapperProps) {
  const { t } = useTranslation();

  const [volumeHover, setVolumeHover] = useState<number | undefined>();
  const [rightLabel, setRightLabel] = useState<string | undefined>();
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  const reversedGlobalCharts = useMemo(() => {
    if (!globalCharts) return undefined;
    return [...globalCharts.content].reverse();
  }, [globalCharts]);

  const volumeDayData = useMemo(() => {
    if (!reversedGlobalCharts) return undefined;

    return reversedGlobalCharts.map((data) => ({
      volumeUSD: Number(data.volumeUSD),
      timestamp: Number(data.snapshotTime),
    }));
  }, [reversedGlobalCharts]);

  const formattedVolumeData = useMemo(() => {
    if (!volumeDayData) return undefined;

    return volumeDayData.map((ele) => ({
      time: dayjs(ele.timestamp).format("YYYY-MM-DD"),
      value: ele.volumeUSD,
    }));
  }, [volumeDayData]);

  const weeklyVolumeData = useTransformedVolumeData(volumeDayData, "week");
  const monthlyVolumeData = useTransformedVolumeData(volumeDayData, "month");

  return (
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
            volumeWindow === VolumeWindow.daily ? "daily" : volumeWindow === VolumeWindow.monthly ? "monthly" : "weekly"
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
                  tips={t`Volume is calculated only based on the total value of tokens listed on the Tokenlist.`}
                />
              </Box>
              <Typography color="text.primary" fontWeight={600} fontSize="32px">
                {volumeHover === undefined
                  ? globalProtocol
                    ? formatDollarAmount(globalProtocol.volumeUSD24H)
                    : ""
                  : formatDollarAmount(volumeHover)}
              </Typography>
              {rightLabel || globalProtocol?.volumeUSD24H ? (
                <Typography fontSize="12px" height="14px">
                  {rightLabel || "The last 24H"}
                </Typography>
              ) : null}
            </GridAutoRows>
          }
        />
      ) : null}
    </MainCard>
  );
}
