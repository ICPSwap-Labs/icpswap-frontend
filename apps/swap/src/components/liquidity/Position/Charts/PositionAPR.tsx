import { useState, useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { BigNumber, isUndefinedOrNull, nonUndefinedOrNull, numToPercent } from "@icpswap/utils";
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
    if (nonUndefinedOrNull(positionChartData) && nonUndefinedOrNull(averageAprResult)) {
      return positionChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime)).format("YYYY-MM-DD HH:mm:ss"),
          value: new BigNumber(data.apr).dividedBy(100).toNumber(),
        };
      });
    }

    return null;
  }, [positionChartData, averageAprResult]);

  const latestPositionValue =
    nonUndefinedOrNull(formattedChartData) && formattedChartData.length > 0
      ? formattedChartData[formattedChartData.length - 1]
      : null;

  const averageApr = useMemo(() => {
    if (isUndefinedOrNull(averageAprResult)) return null;

    if (aprTime === ChartTimeEnum["24H"]) return averageAprResult.aprAvg1D;
    if (aprTime === ChartTimeEnum["7D"]) return averageAprResult.aprAvg7D;

    return averageAprResult.aprAvg30D;
  }, [averageAprResult, aprTime]);

  const lineY = useMemo(() => {
    return averageApr
      ? new BigNumber(averageApr).isLessThan(1)
        ? new BigNumber(averageApr).dividedBy(100).toFixed(4)
        : new BigNumber(averageApr).dividedBy(100).toFixed(2)
      : null;
  }, [averageApr]);

  return (
    <>
      {loading || isUndefinedOrNull(formattedChartData) ? (
        <Box sx={{ width: "100%", minHeight: "300px" }}>
          <ImageLoading loading={loading} />
        </Box>
      ) : formattedChartData.length > 0 ? (
        <>
          <Box sx={{ height: "50px" }}>
            {latestPositionValue ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {numToPercent(nonUndefinedOrNull(latestValue) ? latestValue : latestPositionValue.value, 2)}
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
                yTickFormatter={(val: string) => numToPercent(val)}
                tipFormat="MMM D, YYYY HH:mm:ss"
                extraNode={
                  nonUndefinedOrNull(averageApr) && nonUndefinedOrNull(lineY) ? (
                    <ReferenceLine
                      stroke={theme.colors.apr}
                      y={lineY}
                      label={
                        // @ts-ignore
                        <ChartAPRLabel
                          apr={
                            new BigNumber(averageApr).isLessThan(1)
                              ? numToPercent(new BigNumber(averageApr).dividedBy(100).toString(), 4)
                              : numToPercent(new BigNumber(averageApr).dividedBy(100).toString(), 2)
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
      ) : (
        <Flex sx={{ width: "100%", minHeight: "300px" }} justify="center">
          <Typography sx={{ fontSize: "12px" }}>New position added, data updates tomorrow</Typography>
        </Flex>
      )}
    </>
  );
}
