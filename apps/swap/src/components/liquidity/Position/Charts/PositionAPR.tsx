import { useState, useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { BigNumber, isNullArgs, numToPercent } from "@icpswap/utils";
import { usePositionAPRChartData, usePoolAPRs } from "@icpswap/hooks";
import { type Null, APRChartTime } from "@icpswap/types";
import { LineChartAlt, ImageLoading } from "@icpswap/ui";
import { ReferenceLine } from "recharts";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

const CHART_HEIGHT = 240;

interface APRLabelProps {
  apr: string;
  viewBox: { x: number; y: number; width: number; height: number };
}

function APRLabel(props: APRLabelProps) {
  const theme = useTheme();

  const wrapperHeight = 16;
  const wrapperY = props.viewBox.y - wrapperHeight / 2;

  return (
    <>
      <defs>
        <path
          id="pool-apr-label"
          d={`M10 ${wrapperY + wrapperHeight / 2 + 1},64,${wrapperY + wrapperHeight / 2 + 1}`}
          style={{
            stroke: "white",
            fill: "none",
          }}
        />
      </defs>

      <g width={54} height={16}>
        <rect x="10" y={wrapperY} width={54} height={16} fill={theme.colors.apr} rx="4" />
        <text
          fontSize="12px"
          fontWeight={500}
          fill={theme.colors.darkLevel1}
          style={{
            textAnchor: "middle",
            dominantBaseline: "middle",
          }}
        >
          <textPath xlinkHref="#pool-apr-label" startOffset="50%">
            {props.apr}
          </textPath>
        </text>
      </g>
    </>
  );
}

interface PositionFeesChartProps {
  poolId: string | Null;
  positionId: bigint | Null;
  time: APRChartTime;
}

export function PositionAPRChart({ poolId, time, positionId }: PositionFeesChartProps) {
  const theme = useTheme();
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: positionChartData, loading } = usePositionAPRChartData(poolId, positionId);
  const { result: aprResult } = usePoolAPRs(poolId);

  const formattedChartData = useMemo(() => {
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

  const latestPositionValue = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1] : null;

  const apr = useMemo(() => {
    if (isNullArgs(aprResult)) return null;

    if (time === APRChartTime["24H"]) return aprResult.aprAvg1D;
    if (time === APRChartTime["7D"]) return aprResult.aprAvg7D;

    return aprResult.aprAvg30D;
  }, [aprResult, time]);

  const aprY = useMemo(() => {
    if (
      isNullArgs(apr) ||
      isNullArgs(formattedChartData) ||
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

    return ((diff - apr) / diff) * CHART_HEIGHT;
  }, [formattedChartData, apr, time]);

  const lineY = useMemo(() => {
    return apr
      ? new BigNumber(apr).isLessThan(1)
        ? new BigNumber(apr).toFixed(4)
        : new BigNumber(apr).toFixed(4)
      : null;
  }, [apr]);

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
                  {latestValue ? numToPercent(latestValue, 2) : numToPercent(latestPositionValue.value, 2)}
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
                yTickFormatter={(val: string) => numToPercent(val, 2)}
                tipFormat="MMM D, YYYY HH:mm:ss"
                extraNode={
                  aprY && apr && lineY ? (
                    <ReferenceLine
                      stroke={theme.colors.apr}
                      y={lineY}
                      label={
                        // @ts-ignore
                        <APRLabel
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
