import { usePositionFeesChartData } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { Flex, ImageLoading, LineChartAlt } from "@icpswap/ui";
import { formatDollarAmount, nonUndefinedOrNull } from "@icpswap/utils";
import { Box, Typography } from "components/Mui";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

interface PositionFeesChartProps {
  poolId: string | Null;
  positionId: bigint | Null;
}

export function PositionFeesChart({ poolId, positionId }: PositionFeesChartProps) {
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { data: positionChartData, isLoading: loading } = usePositionFeesChartData(poolId, positionId);

  const formattedChartData = useMemo(() => {
    if (positionChartData) {
      return positionChartData.map((data) => {
        return {
          time: data.snapshotTime,
          value: data.fees,
        };
      });
    }
    return [];
  }, [positionChartData]);

  const latestPositionValue = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1] : null;

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
                  {nonUndefinedOrNull(latestValue)
                    ? formatDollarAmount(latestValue)
                    : formatDollarAmount(formattedChartData[formattedChartData.length - 1]?.value)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    margin: "8px 0 0 0",
                  }}
                >
                  {valueLabel ??
                    dayjs(formattedChartData[formattedChartData.length - 1]?.time).format("MMM D, YYYY HH:mm:ss") ??
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
            {formattedChartData.length > 0 ? (
              <LineChartAlt
                data={formattedChartData}
                setLabel={setValueLabel}
                minHeight={260}
                setValue={setLatestValue}
                value={latestValue}
                label={valueLabel}
                showXAxis={false}
                showYAxis
                xTickFormatter={(time: string) => {
                  return dayjs(time).format("MMM D, YYYY HH:mm:ss");
                }}
                yTickFormatter={(val: string) => formatDollarAmount(val)}
                tipFormat="MMM D, YYYY HH:mm:ss"
              />
            ) : (
              <Box sx={{ height: "260px", width: "auto" }} />
            )}
          </Box>
        </>
      )}
    </>
  );
}
