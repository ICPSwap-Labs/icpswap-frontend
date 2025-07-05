import { useState, useMemo, useEffect } from "react";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { usePoolAPRChartData, usePoolAverageAPRs } from "@icpswap/hooks";
import { type Null, ChartTimeEnum } from "@icpswap/types";
import { ReferenceLine } from "recharts";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { ImageLoading } from "../Loading";
import { LineChartAlt } from "../LineChart/alt";
import { Typography, Box, useTheme } from "../Mui";
import { ChartAPRLabel } from "./ChartAPRLabel";

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
  const [time, setTime] = useState<ChartTimeEnum>(ChartTimeEnum["7D"]);

  const { result: poolChartData, loading } = usePoolAPRChartData(poolId);
  const { result: averageAprResult } = usePoolAverageAPRs(poolId);

  const formattedChartData = useMemo(() => {
    if (poolChartData) {
      return [...poolChartData].reverse().map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime)).format("YYYY-MM-DD HH:mm:ss"),
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

    return diff.minus(averageApr).dividedBy(diff).multipliedBy(parseInt(height)).toString();
  }, [formattedChartData, averageApr, time]);

  useEffect(() => {
    setTime(__time);
  }, [__time]);

  const averageAprSvgY = useMemo(() => {
    return new BigNumber(averageApr).isLessThan(1)
      ? new BigNumber(averageApr).toFixed(4)
      : new BigNumber(averageApr).toFixed(2);
  }, [averageApr]);

  return (
    <>
      {loading ? (
        <Box sx={{ width: "100%", height }}>
          <ImageLoading loading={loading} />
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
                minHeight={parseInt(height)}
                setValue={setLatestValue}
                value={latestValue}
                label={valueLabel}
                showXAxis={false}
                showYAxis
                yTickFormatter={(val: string) => `${new BigNumber(val).toFixed(2)}%`}
                tipFormat="MMM D, YYYY HH:mm:ss"
                extraNode={
                  averageAprSvgHeight && averageApr ? (
                    <ReferenceLine
                      stroke={theme.colors.apr}
                      y={averageAprSvgY}
                      label={
                        // @ts-ignore
                        <ChartAPRLabel apr={`${new BigNumber(averageApr).toFixed(2)}%`} />
                      }
                      strokeDasharray="5 4"
                    />
                  ) : null
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
