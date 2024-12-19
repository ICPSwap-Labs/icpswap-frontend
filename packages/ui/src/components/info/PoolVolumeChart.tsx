import { useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { VolumeWindow, PublicPoolChartDayData, Null } from "@icpswap/types";
import { useTransformedVolumeData, usePoolAllChartData } from "@icpswap/hooks";

import { formatDollarAmount } from "@icpswap/utils";
import { BarChartAlt } from "../BarChart/alt";
import { ImageLoading } from "../Loading";
import { Box, Typography } from "../Mui";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

function volumeDataFormatter(data: PublicPoolChartDayData[]) {
  const oldData = [...data];

  const newData: PublicPoolChartDayData[] = [];

  // Fill the empty data between origin data
  for (let i = 0; i < oldData.length; i++) {
    const curr = oldData[i];
    const next = oldData[i + 1];

    if (next) {
      const diff = next.timestamp - curr.timestamp;
      const days = parseInt((Number(diff) / (3600 * 24)).toString());

      if (days === 1) {
        newData.push(curr);
      } else {
        // push curr data
        newData.push(curr);

        for (let i = 1; i < days; i++) {
          newData.push({
            id: BigInt(0),
            volumeUSD: 0,
            timestamp: BigInt(Number(curr.timestamp) + 24 * 3600 * i),
            txCount: BigInt(0),
          });
        }
      }
    } else {
      newData.push(curr);
    }
  }

  const now = new Date().getTime();
  const endTime = oldData[oldData.length - 1].timestamp;
  const days = parseInt(((now - Number(endTime) * 1000) / (1000 * 3600 * 24)).toString());

  // Fill the latest data to today
  for (let i = 1; i <= days; i++) {
    newData.push({
      id: BigInt(0),
      volumeUSD: 0,
      timestamp: BigInt(Number(endTime) + 24 * 3600 * i),
      txCount: BigInt(0),
    });
  }

  return newData;
}

export interface PoolChartProps {
  canisterId: string;
  volumeWindow?: VolumeWindow;
  noData?: React.ReactNode;
  height?: string;
  defaultValue?: string | number | Null;
}

export function PoolVolumeChart({ noData, volumeWindow, canisterId, height = "340px", defaultValue }: PoolChartProps) {
  const [label, setLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: allChartsData, loading } = usePoolAllChartData(canisterId);

  const chartData = useMemo(() => {
    return allChartsData
      ?.filter((data) => data.timestamp !== BigInt(0))
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
      });
  }, [allChartsData]);

  const volumeData = useMemo(() => {
    if (chartData) {
      return volumeDataFormatter(chartData)
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
          return {
            date: Number(data.timestamp),
            volumeUSD: data.volumeUSD,
          };
        });
    }

    return [];
  }, [chartData]);

  const dailyVolumeData = useMemo(() => {
    if (chartData) {
      return volumeDataFormatter(chartData)
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
          return {
            time: dayjs(Number(Number(data.timestamp) * 1000)).format("YYYY-MM-DD HH:mm:ss"),
            value: data.volumeUSD,
          };
        });
    }

    return [];
  }, [chartData]);

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
