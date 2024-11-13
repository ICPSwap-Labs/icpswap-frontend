import { useState, useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { BigNumber, isNullArgs, numToPercent } from "@icpswap/utils";
import { usePositionAPRChartData, usePositionAPRs } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { LineChartAlt, ImageLoading } from "@icpswap/ui";
import { ReferenceLine } from "recharts";
import { PositionChartTimes } from "types/swap";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

const CHART_HEIGHT = 340;

interface PositionFeesChartProps {
  poolId: string | Null;
  positionId: bigint | Null;
  time: PositionChartTimes;
}

export function PositionAPRChart({ poolId, time, positionId }: PositionFeesChartProps) {
  const theme = useTheme();
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: positionChartData, loading } = usePositionAPRChartData(poolId, positionId);
  const { result: aprResult } = usePositionAPRs(poolId);

  const formattedPositionValueChartData = useMemo(() => {
    if (positionChartData) {
      return positionChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss"),
          value: data.apr,
        };
      });
    }
    return [];
  }, [positionChartData]);

  const latestPositionValue =
    formattedPositionValueChartData.length > 0
      ? formattedPositionValueChartData[formattedPositionValueChartData.length - 1]
      : null;

  const apr = useMemo(() => {
    if (isNullArgs(aprResult)) return null;

    if (time === PositionChartTimes["24H"]) return aprResult.aprAvg1D;
    if (time === PositionChartTimes["7D"]) return aprResult.aprAvg7D;

    return aprResult.aprAvg30D;
  }, [aprResult, time]);

  const aprY = useMemo(() => {
    if (
      isNullArgs(apr) ||
      isNullArgs(formattedPositionValueChartData) ||
      formattedPositionValueChartData.length < 2 ||
      new BigNumber(apr).isEqualTo(0)
    )
      return null;

    const sortedData = [...formattedPositionValueChartData].sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });

    const diff = sortedData[0].value - sortedData[sortedData.length - 1].value;

    return ((diff - apr) / diff) * CHART_HEIGHT;
  }, [formattedPositionValueChartData, apr, time]);

  return (
    <>
      {loading ? (
        <Box sx={{ width: "100%", minHeight: "300px" }}>
          <ImageLoading loading={loading} />
        </Box>
      ) : (
        <>
          <Box sx={{ height: "50px" }}>
            {latestPositionValue ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {latestValue
                    ? numToPercent(latestValue, 2)
                    : numToPercent(
                        formattedPositionValueChartData[formattedPositionValueChartData.length - 1]?.value,
                        2,
                      )}
                </Typography>

                <Typography
                  sx={{
                    height: "20px",
                    fontSize: "12px",
                    margin: "10px 0 0 0",
                  }}
                >
                  {valueLabel ??
                    dayjs(formattedPositionValueChartData[formattedPositionValueChartData.length - 1]?.time).format(
                      "MMM D, YYYY HH:mm:ss",
                    ) ??
                    ""}
                </Typography>
              </>
            ) : null}
          </Box>

          <Box
            sx={{
              margin: "40px 0 0 0",
            }}
          >
            {formattedPositionValueChartData.length > 0 ? (
              <LineChartAlt
                data={formattedPositionValueChartData}
                setLabel={setValueLabel}
                minHeight={CHART_HEIGHT}
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
                      y={
                        new BigNumber(apr).isLessThan(1) ? new BigNumber(apr).toFixed(2) : new BigNumber(apr).toFixed(0)
                      }
                      label={
                        <g x="0" y="170">
                          <rect x="16" y={aprY} width={40} height={16} fill={theme.colors.apr} rx="4" />
                          <text x="25" y={aprY + 12} fill={theme.colors.darkLevel1} fontSize={12}>
                            {new BigNumber(apr).isLessThan(0.01) ? numToPercent(apr, 2) : numToPercent(apr, 0)}
                          </text>
                        </g>
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
