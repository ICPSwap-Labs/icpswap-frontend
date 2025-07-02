import { useState, useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { BigNumber, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { usePositionAPRChartData, usePoolAverageAPRs } from "@icpswap/hooks";
import { type Null, ChartTimeEnum } from "@icpswap/types";
import { LineChartAlt, ImageLoading, ChartAPRLabel, Flex } from "@icpswap/ui";
import { ReferenceLine } from "recharts";
import dayjs from "dayjs";

const CHART_HEIGHT = 240;

interface PositionFeesChartProps {
  poolId: string | Null;
  positionId: bigint | Null;
  time: ChartTimeEnum;
}

export function PositionAPRChart({ poolId, time: aprTime, positionId }: PositionFeesChartProps) {
  const theme = useTheme();
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: positionChartData, loading } = usePositionAPRChartData(poolId, positionId);
  const { result: averageAprResult } = usePoolAverageAPRs(poolId);

  const formattedChartData = useMemo(() => {
    if (positionChartData) {
      return positionChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime)).format("YYYY-MM-DD HH:mm:ss"),
          value: Number(data.apr),
        };
      });
    }
    return [];
  }, [positionChartData]);

  const latestPositionValue = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1] : null;

  const averageApr = useMemo(() => {
    if (isUndefinedOrNull(averageAprResult)) return null;

    if (aprTime === ChartTimeEnum["24H"]) return averageAprResult.aprAvg1D;
    if (aprTime === ChartTimeEnum["7D"]) return averageAprResult.aprAvg7D;

    return averageAprResult.aprAvg30D;
  }, [averageAprResult, aprTime]);

  const aprY = useMemo(() => {
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

    const diff = sortedData[0].value - sortedData[sortedData.length - 1].value;

    return ((diff - Number(averageApr)) / diff) * CHART_HEIGHT;
  }, [formattedChartData, averageApr]);

  const lineY = useMemo(() => {
    return averageApr
      ? new BigNumber(averageApr).isLessThan(1)
        ? new BigNumber(averageApr).toFixed(4)
        : new BigNumber(averageApr).toFixed(4)
      : null;
  }, [averageApr]);

  return (
    <>
      {loading ? (
        <Box sx={{ width: "100%", minHeight: "300px" }}>
          <ImageLoading loading={loading} />
        </Box>
      ) : (
        <>
          {formattedChartData.length === 0 ? (
            <Flex sx={{ width: "100%", minHeight: "300px" }} justify="center">
              <Typography sx={{ fontSize: "12px" }}>New position added, data updates tomorrow</Typography>
            </Flex>
          ) : null}

          <Box sx={{ height: "50px" }}>
            {latestPositionValue ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {new BigNumber(nonUndefinedOrNull(latestValue) ? latestValue : latestPositionValue.value).toFixed(2)}%
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    margin: "8px 0 0 0",
                  }}
                >
                  {valueLabel ?? dayjs(latestPositionValue.time).format("MMM D, YYYY HH:mm:ss") ?? ""}
                </Typography>
              </>
            ) : null}
          </Box>

          <Box
            sx={{
              margin: "30px 0 0 0",
            }}
          >
            {formattedChartData.length > 0 ? (
              <LineChartAlt
                data={formattedChartData}
                setLabel={setValueLabel}
                minHeight={CHART_HEIGHT}
                setValue={setLatestValue}
                value={latestValue}
                label={valueLabel}
                showXAxis={false}
                showYAxis
                yTickFormatter={(val: string) => `${new BigNumber(val).toFixed(2)}%`}
                tipFormat="MMM D, YYYY HH:mm:ss"
                extraNode={
                  aprY && averageApr && lineY ? (
                    <ReferenceLine
                      stroke={theme.colors.apr}
                      y={lineY}
                      label={
                        // @ts-ignore
                        <ChartAPRLabel
                          apr={
                            new BigNumber(averageApr).isLessThan(1)
                              ? `${new BigNumber(averageApr).toFixed(4)}%`
                              : `${new BigNumber(averageApr).toFixed(2)}%`
                          }
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
