import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { VolumeWindow } from "@icpswap/types";
import { usePoolTvlChartData } from "@icpswap/hooks";

import { ImageLoading } from "../Loading";
import { LineChartAlt } from "../LineChart/alt";
import { Box } from "../Mui";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export interface PoolTvlChartProps {
  canisterId: string;
  noData?: React.ReactNode;
  volumeWindow?: VolumeWindow;
  setLatestValue?: (value: number | undefined) => void;
  setValueLabel?: (label: string | undefined) => void;
  loadingBackground?: string;
}

export function PoolTvlChart({
  setValueLabel,
  setLatestValue,
  noData,
  canisterId,
  loadingBackground,
}: PoolTvlChartProps) {
  const { result: poolChartTVl, loading } = usePoolTvlChartData(canisterId);

  const formattedTvlData = useMemo(() => {
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
  ) : formattedTvlData.length > 0 ? (
    <LineChartAlt data={formattedTvlData} setLabel={setValueLabel} minHeight={340} setValue={setLatestValue} />
  ) : noData ? (
    <>{noData}</>
  ) : null;
}
