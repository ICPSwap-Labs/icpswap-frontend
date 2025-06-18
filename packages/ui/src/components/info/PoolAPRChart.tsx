import { useState, useMemo, useEffect } from "react";
import { BigNumber, isUndefinedOrNull, numToPercent } from "@icpswap/utils";
import { usePoolAPRChartData, usePoolAPRs } from "@icpswap/hooks";
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
  const { result: aprResult } = usePoolAPRs(poolId);

  const formattedChartData = useMemo(() => {
    if (poolChartData) {
      return poolChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss"),
          value: data.apr,
        };
      });
    }
    return [];
  }, [poolChartData]);

  const latestData = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1] : null;

  const apr = useMemo(() => {
    if (isUndefinedOrNull(aprResult)) return null;

    if (time === ChartTimeEnum["24H"]) return aprResult.aprAvg1D;
    if (time === ChartTimeEnum["7D"]) return aprResult.aprAvg7D;

    return aprResult.aprAvg30D;
  }, [aprResult, time]);

  const aprY = useMemo(() => {
    if (
      isUndefinedOrNull(apr) ||
      isUndefinedOrNull(formattedChartData) ||
      formattedChartData.length < 2 ||
      new BigNumber(apr).isEqualTo(0)
    )
      return null;

    const sortedData = [...formattedChartData].sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });

    const diff = sortedData[0].value - sortedData[sortedData.length - 1].value;

    return ((diff - apr) / diff) * parseInt(height);
  }, [formattedChartData, apr, time]);

  useEffect(() => {
    setTime(__time);
  }, [__time]);

  const lineY = useMemo(() => {
    return new BigNumber(apr).isLessThan(1) ? new BigNumber(apr).toFixed(4) : new BigNumber(apr).toFixed(4);
  }, [apr]);

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
                  {latestValue ? numToPercent(latestValue, 2) : numToPercent(latestData.value, 2)}
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
                yTickFormatter={(val: string) => numToPercent(val, 2)}
                tipFormat="MMM D, YYYY HH:mm:ss"
                extraNode={
                  aprY && apr ? (
                    <ReferenceLine
                      stroke={theme.colors.apr}
                      y={lineY}
                      label={
                        // @ts-ignore
                        <ChartAPRLabel
                          apr={new BigNumber(apr).isLessThan(0.01) ? numToPercent(apr, 2) : numToPercent(apr, 2)}
                        />
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
