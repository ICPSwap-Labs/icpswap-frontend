import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { VolumeWindow, PublicPoolChartDayData } from "@icpswap/types";
import { useTransformedVolumeData, usePoolAllChartData } from "@icpswap/hooks";

import { BarChartAlt } from "../BarChart/alt";
import { ImageLoading } from "../Loading";
import { Box } from "../Mui";

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
  setLatestValue?: (value: number) => void;
  setValue: (value: number) => void;
  loadingBackground?: string;
  needUpdateValue?: boolean;
}

export function PoolVolumeChart({
  noData,
  volumeWindow,
  canisterId,
  setLatestValue: __setLatestValue,
  loadingBackground,
  needUpdateValue = true,
  setValue,
}: PoolChartProps) {
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

  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

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

  const formattedVolumeData = useMemo(() => {
    if (volumeWindow === VolumeWindow.daily) return dailyVolumeData;
    if (volumeWindow === VolumeWindow.monthly) return monthlyVolumeData;
    return weeklyVolumeData;
  }, [weeklyVolumeData, monthlyVolumeData, dailyVolumeData, volumeWindow]);

  useEffect(() => {
    if (__setLatestValue) {
      __setLatestValue(formattedVolumeData[formattedVolumeData.length - 1]?.value);
    }
  }, [__setLatestValue, formattedVolumeData]);

  const handleSetValue = useCallback(
    (value: number) => {
      setValue(value);
      setLatestValue(value);
    },
    [setValue, setLatestValue],
  );

  return loading ? (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        top: "0",
        left: "0",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: loadingBackground,
        zIndex: 100,
      }}
    >
      <ImageLoading loading />
    </Box>
  ) : formattedVolumeData && formattedVolumeData.length > 0 ? (
    <BarChartAlt
      data={formattedVolumeData}
      minHeight={340}
      setValue={handleSetValue}
      setLabel={setValueLabel}
      value={latestValue}
      label={valueLabel}
      activeWindow={
        volumeWindow === VolumeWindow.daily ? "daily" : volumeWindow === VolumeWindow.monthly ? "monthly" : "weekly"
      }
    />
  ) : noData ? (
    <>{noData}</>
  ) : null;
}
