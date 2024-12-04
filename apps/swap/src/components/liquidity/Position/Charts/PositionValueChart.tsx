import { useState, useMemo } from "react";
import { Typography, Box } from "components/Mui";
import { formatDollarAmount, nonNullArgs } from "@icpswap/utils";
import { usePositionValueChartData } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { LineChartAlt, ImageLoading, Flex } from "@icpswap/ui";
import dayjs from "dayjs";

export interface TokenChartsProps {
  poolId: string | Null;
  positionId: bigint | Null;
}

export function PositionValueChart({ poolId, positionId }: TokenChartsProps) {
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: positionValueChartData, loading } = usePositionValueChartData(poolId, positionId);

  const formattedPositionValueChartData = useMemo(() => {
    if (positionValueChartData) {
      return positionValueChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss"),
          value: data.value,
        };
      });
    }
    return [];
  }, [positionValueChartData]);

  const latestPositionValue =
    formattedPositionValueChartData.length > 0
      ? formattedPositionValueChartData[formattedPositionValueChartData.length - 1]
      : null;

  return (
    <>
      {loading ? (
        <Box sx={{ width: "100%", minHeight: "300px" }}>
          <ImageLoading loading={loading} />
        </Box>
      ) : (
        <>
          {formattedPositionValueChartData.length === 0 ? (
            <Flex sx={{ width: "100%", minHeight: "300px" }} justify="center">
              <Typography sx={{ fontSize: "12px" }}>New position added, data updates tomorrow</Typography>
            </Flex>
          ) : null}

          <Box sx={{ height: "50px" }}>
            {latestPositionValue ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {nonNullArgs(latestValue)
                    ? formatDollarAmount(latestValue)
                    : formatDollarAmount(
                        formattedPositionValueChartData[formattedPositionValueChartData.length - 1]?.value,
                      )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    margin: "8px 0 0 0",
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
                minHeight={280}
                setValue={setLatestValue}
                value={latestValue}
                label={valueLabel}
                showXAxis={false}
                showYAxis
                xTickFormatter={(time: string) => {
                  return dayjs(time).format("MMM D, YYYY HH:mm:ss");
                }}
                yTickFormatter={(val: string) => formatDollarAmount(val, 2)}
                tipFormat="MMM D, YYYY HH:mm:ss"
              />
            ) : (
              <Box sx={{ height: "280px", width: "auto" }} />
            )}
          </Box>
        </>
      )}
    </>
  );
}
