import type { InfoPoolDataResponse, VolumeWindow } from "@icpswap/types";
import { formatDollarAmount, nonUndefinedOrNull } from "@icpswap/utils";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { LineChartAlt } from "../LineChart/alt";
import { ImageLoading } from "../Loading";
import { Box, Typography } from "../Mui";

export interface PoolTvlChartProps {
  noData?: React.ReactNode;
  volumeWindow?: VolumeWindow;
  height?: string;
  chartsData: Array<InfoPoolDataResponse>;
  loading: boolean;
}

export function PoolTvlChart({ chartsData, loading, noData, height = "340px" }: PoolTvlChartProps) {
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const formattedData = useMemo(() => {
    return chartsData.map((data) => {
      return {
        time: Number(data.beginTime),
        value: Number(data.tvlUSD),
      };
    });
  }, [chartsData]);

  const latestData = formattedData.length > 0 ? formattedData[formattedData.length - 1] : null;

  return (
    <>
      {loading ? (
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
                  {nonUndefinedOrNull(latestValue)
                    ? formatDollarAmount(latestValue)
                    : formatDollarAmount(latestData.value)}
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
            minHeight={parseInt(height, 10)}
            setValue={setLatestValue}
          />
        </>
      ) : noData ? (
        noData
      ) : null}
    </>
  );
}
