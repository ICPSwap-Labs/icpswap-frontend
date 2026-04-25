import { usePoolAPRChartData, usePoolAverageAPRs } from "@icpswap/hooks";
import { ChartTimeEnum, type Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useMemo, useState } from "react";
import { LineChartAlt } from "../LineChart/alt";
import { ImageLoading } from "../Loading";
import { Box, Typography, useTheme } from "../Mui";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export interface PoolAPRChartProps {
  poolId: string | Null;
  height?: string;
  time?: ChartTimeEnum;
}

export function PoolAPRChart({ poolId, time: __time, height = "340px" }: PoolAPRChartProps) {
  const theme = useTheme();
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { data: poolChartData, isLoading } = usePoolAPRChartData(poolId);
  const { data: averageAprResult } = usePoolAverageAPRs(poolId);

  const time = useMemo(() => {
    return __time ? __time : ChartTimeEnum["7D"];
  }, [__time]);

  const formattedChartData = useMemo(() => {
    if (poolChartData) {
      return [...poolChartData].reverse().map((data) => {
        return {
          time: Number(data.snapshotTime),
          value: Number(data.apr),
        };
      });
    }
    return [];
  }, [poolChartData]);

  const latestData = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1] : null;

  const averageApr = useMemo(() => {
    if (isUndefinedOrNull(averageAprResult)) return null;

    if (time === ChartTimeEnum["24H"]) return averageAprResult.aprAvg1D;
    if (time === ChartTimeEnum["7D"]) return averageAprResult.aprAvg7D;

    return averageAprResult.aprAvg30D;
  }, [averageAprResult, time]);

  const averageAprSvgHeight = useMemo(() => {
    if (
      isUndefinedOrNull(averageApr) ||
      isUndefinedOrNull(formattedChartData) ||
      formattedChartData.length < 2 ||
      new BigNumber(averageApr).isEqualTo(0)
    )
      return null;

    const sortedData = [...formattedChartData].sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });

    const diff = new BigNumber(sortedData[0].value).minus(sortedData[sortedData.length - 1].value);

    return diff.minus(averageApr).dividedBy(diff).multipliedBy(parseInt(height, 10)).toString();
  }, [formattedChartData, averageApr, height]);

  const averageAprSvgY = useMemo(() => {
    return new BigNumber(averageApr).isLessThan(1)
      ? new BigNumber(averageApr).toFixed(4)
      : new BigNumber(averageApr).toFixed(2);
  }, [averageApr]);

  return (
    <>
      {isLoading ? (
        <Box sx={{ width: "100%", height }}>
          <ImageLoading loading={isLoading} />
        </Box>
      ) : (
        <>
          <Box sx={{ height: "50px" }}>
            {latestData ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {new BigNumber(latestValue || latestData.value).toFixed(2)}%
                </Typography>

                <Typography
                  sx={{
                    height: "20px",
                    fontSize: "12px",
                    margin: "10px 0 0 0",
                  }}
                >
                  {valueLabel ?? dayjs(latestData.time).format("MMM D, YYYY HH:mm:ss") ?? ""}
                </Typography>
              </>
            ) : null}
          </Box>

          <Box
            sx={{
              margin: "40px 0 0 0",
            }}
          >
            {formattedChartData.length > 0 ? (
              <LineChartAlt
                data={formattedChartData}
                setLabel={setValueLabel}
                minHeight={parseInt(height, 10)}
                setValue={setLatestValue}
                showXAxis={false}
                showYAxis
                yTickFormatter={(val: string) => `${new BigNumber(val).toFixed(2)}%`}
                tipFormat="MMM D, YYYY HH:mm:ss"
                markLine={
                  averageAprSvgHeight && averageApr
                    ? {
                        y: averageAprSvgY,
                        color: theme.colors.apr,
                        labelText: `Avg ${new BigNumber(averageApr).toFixed(2)}%`,
                      }
                    : undefined
                }
              />
            ) : (
              <Box sx={{ height: "340px", width: "auto" }} />
            )}
          </Box>
        </>
      )}
    </>
  );
}
