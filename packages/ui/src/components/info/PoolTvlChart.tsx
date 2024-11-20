import { useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { VolumeWindow } from "@icpswap/types";
import { usePoolTvlChartData } from "@icpswap/hooks";

import { formatDollarAmount } from "@icpswap/utils";
import { ImageLoading } from "../Loading";
import { LineChartAlt } from "../LineChart/alt";
import { Box, Typography } from "../Mui";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export interface PoolTvlChartProps {
  canisterId: string;
  noData?: React.ReactNode;
  volumeWindow?: VolumeWindow;
  height?: string;
}

export function PoolTvlChart({ noData, canisterId, height = "340px" }: PoolTvlChartProps) {
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: poolChartTVl, loading } = usePoolTvlChartData(canisterId);

  const formattedData = useMemo(() => {
    if (poolChartTVl) {
      return poolChartTVl
        .filter((data) => Number(data.timestamp) !== 0)
        .map((data) => {
          return {
            time: dayjs(Number(data.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss"),
            value: data.tvlUSD,
          };
        });
    }
    return [];
  }, [poolChartTVl]);

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
  ) : formattedData.length > 0 ? (
    <>
      <Box sx={{ height: "50px" }}>
        {latestData ? (
          <>
            <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
              {latestValue ? formatDollarAmount(latestValue) : formatDollarAmount(latestData.value)}
            </Typography>

            <Typography
              sx={{
                height: "20px",
                fontSize: "12px",
                margin: "10px 0 0 0",
              }}
            >
              {valueLabel ?? dayjs(latestData.time).format("MMM D, YYYY") ?? ""}
            </Typography>
          </>
        ) : null}
      </Box>

      <LineChartAlt
        data={formattedData}
        setLabel={setValueLabel}
        minHeight={parseInt(height)}
        setValue={setLatestValue}
      />
    </>
  ) : noData ? (
    <>{noData}</>
  ) : null;
}
