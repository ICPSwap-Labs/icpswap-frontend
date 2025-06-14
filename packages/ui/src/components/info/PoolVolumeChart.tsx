import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { VolumeWindow, Null, InfoPoolDataResponse } from "@icpswap/types";
import { useTransformedVolumeData } from "@icpswap/hooks";

import { BigNumber, formatDollarAmount } from "@icpswap/utils";
import { BarChartAlt } from "../BarChart/alt";
import { ImageLoading } from "../Loading";
import { Box, Typography } from "../Mui";

type VolumeData = {
  timestamp: number;
  volumeUSD: number;
};

function volumeDataFormatter(data: InfoPoolDataResponse[]) {
  const oldData = [...data];

  const newData: VolumeData[] = [];

  if (data.length === 0) return [];

  // Fill the empty data between origin data
  for (let i = 0; i < oldData.length; i++) {
    const curr = oldData[i];
    const next = oldData[i + 1];

    if (next) {
      const diff = next.beginTime - curr.beginTime;
      const days = parseInt((Number(diff) / (3600 * 24)).toString());

      if (days === 1) {
        newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });
      } else {
        // push curr data
        newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });

        for (let i = 1; i < days; i++) {
          newData.push({
            volumeUSD: 0,
            timestamp: Number(curr.beginTime) + 24 * 3600 * i * 1000,
          });
        }
      }
    } else {
      newData.push({ volumeUSD: new BigNumber(curr.volumeUSD).toNumber(), timestamp: curr.beginTime });
    }
  }

  const now = new Date().getTime();
  const endTime = oldData[oldData.length - 1].beginTime;
  const days = parseInt(((now - Number(endTime) * 1000) / (1000 * 3600 * 24)).toString());

  // Fill the latest data to today
  for (let i = 1; i <= days; i++) {
    newData.push({
      volumeUSD: 0,
      timestamp: Number(endTime) + 24 * 3600 * i,
    });
  }

  return newData;
}

export interface PoolChartProps {
  chartsData: Array<InfoPoolDataResponse>;
  loading: boolean;
  volumeWindow?: VolumeWindow;
  noData?: React.ReactNode;
  height?: string;
  defaultValue?: string | number | Null;
}

export function PoolVolumeChart({
  chartsData,
  loading,
  noData,
  volumeWindow,
  height = "340px",
  defaultValue,
}: PoolChartProps) {
  const [label, setLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const volumeData = useMemo(() => {
    return volumeDataFormatter(chartsData).map((data) => {
      return {
        timestamp: data.timestamp,
        volumeUSD: data.volumeUSD,
      };
    });
  }, [chartsData]);

  const dailyVolumeData = useMemo(() => {
    return volumeData.map((data) => {
      return {
        time: dayjs(data.timestamp).format("YYYY-MM-DD HH:mm:ss"),
        value: data.volumeUSD,
      };
    });
  }, [volumeData]);

  const weeklyVolumeData = useTransformedVolumeData(volumeData, "week");
  const monthlyVolumeData = useTransformedVolumeData(volumeData, "month");

  const formattedData = useMemo(() => {
    if (volumeWindow === VolumeWindow.daily) return dailyVolumeData;
    if (volumeWindow === VolumeWindow.monthly) return monthlyVolumeData;
    return weeklyVolumeData;
  }, [weeklyVolumeData, monthlyVolumeData, dailyVolumeData, volumeWindow]);

  const latestData = formattedData.length > 0 ? formattedData[formattedData.length - 1] : null;

  return loading ? (
    <Box
      sx={{
        width: "100%",
        height,
      }}
    >
      <ImageLoading loading />
    </Box>
  ) : formattedData && formattedData.length > 0 ? (
    <Box sx={{ height: "100%" }}>
      <Box>
        {latestData ? (
          <>
            <Typography
              color="text.primary"
              fontSize="24px"
              fontWeight={500}
              sx={{
                height: "30px",
              }}
            >
              {latestValue
                ? formatDollarAmount(latestValue)
                : formatDollarAmount(defaultValue) ?? formatDollarAmount(latestData.value)}
            </Typography>

            <Typography
              color="text.primary"
              fontWeight={500}
              sx={{
                height: "20px",
              }}
              fontSize="12px"
            >
              {label ?? ""}
            </Typography>
          </>
        ) : null}
      </Box>

      <BarChartAlt
        data={formattedData}
        minHeight={parseInt(height)}
        setValue={setLatestValue}
        setLabel={setLabel}
        value={latestValue}
        label={label}
        activeWindow={
          volumeWindow === VolumeWindow.daily ? "daily" : volumeWindow === VolumeWindow.monthly ? "monthly" : "weekly"
        }
      />
    </Box>
  ) : noData ? (
    <>{noData}</>
  ) : null;
}
