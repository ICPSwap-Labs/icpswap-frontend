import { useState, useMemo } from "react";
import { Typography, Box } from "components/Mui";
import { formatDollarAmount } from "@icpswap/utils";
import { usePositionFeesChartData } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { LineChartAlt, ImageLoading } from "@icpswap/ui";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

interface PositionFeesChartProps {
  poolId: string | Null;
  positionId: bigint | Null;
}

export function PositionFeesChart({ poolId, positionId }: PositionFeesChartProps) {
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: positionChartData, loading } = usePositionFeesChartData(poolId, positionId);

  const formattedPositionValueChartData = useMemo(() => {
    if (positionChartData) {
      return positionChartData.map((data) => {
        return {
          time: dayjs(Number(data.snapshotTime * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss"),
          value: data.fees,
        };
      });
    }
    return [];
  }, [positionChartData]);

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
          <Box sx={{ height: "50px" }}>
            {latestPositionValue ? (
              <>
                <Typography color="text.primary" fontSize="28px" fontWeight={500} component="div">
                  {latestValue
                    ? formatDollarAmount(latestValue)
                    : formatDollarAmount(
                        formattedPositionValueChartData[formattedPositionValueChartData.length - 1]?.value,
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
                minHeight={340}
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
              <Box sx={{ height: "340px", width: "auto" }} />
            )}
          </Box>
        </>
      )}
    </>
  );
}
