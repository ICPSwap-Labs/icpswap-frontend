import { Box, Typography, useTheme } from "components/Mui";
import { MainCard } from "components/index";
import { Trans } from "@lingui/macro";
import { useStakeAprChartData } from "@icpswap/hooks";

import { useMemo, useState } from "react";
import { ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { darken } from "polished";
import { toSignificantWithGroupSeparator } from "@icpswap/utils";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// format dayjs with the libraries that we need
dayjs.extend(utc);

const DAYJS_FORMAT = "MMM D, YYYY HH:mm:ss";

export interface FarmAprChartsProps {
  canisterId: string | undefined;
}

export function AprChart({ canisterId }: FarmAprChartsProps) {
  const theme = useTheme();

  const [value, setValue] = useState<null | number>(null);
  const [label, setLabel] = useState<null | string>(null);

  const { start_time, end_time } = useMemo(() => {
    const now = parseInt(String(new Date().getTime() / 1000));

    const start_time = now - 30 * 24 * 3600;
    const end_time = now;

    return {
      start_time,
      end_time,
    };
  }, []);

  const { result: aprCharts } = useStakeAprChartData(canisterId, start_time, end_time);

  const chartData = useMemo(() => {
    if (!aprCharts || aprCharts.length === 0) return undefined;

    return aprCharts.map((e) => ({ time: e.time.toString(), value: e.apr * 100 }));
  }, [aprCharts]);

  const color = "#5669dc";

  const defaultAprData = useMemo(() => {
    if (!chartData || chartData.length === 0) return {};

    const latestData = chartData[chartData.length - 1];

    return { time: latestData.time, value: latestData.value };
  }, [chartData]);

  return aprCharts && aprCharts.length > 0 ? (
    <Box
      sx={{
        width: "470px",
        "@media (max-width: 520px)": {
          width: "100%",
        },
      }}
    >
      <MainCard
        borderRadius="16px"
        level={1}
        padding="40px 0 24px 0"
        sx={{
          width: "100%",
          overflow: "hidden",
          height: "fit-content",
        }}
      >
        <Box sx={{ padding: "0 24px" }}>
          <Typography fontSize="16px">
            <Trans>APR</Trans>
          </Typography>

          <Typography
            sx={{
              margin: "12px 0 0 0",
              fontSize: "32px",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {value
              ? `${toSignificantWithGroupSeparator(value, 3)}%`
              : aprCharts
              ? `${defaultAprData.value ? toSignificantWithGroupSeparator(defaultAprData.value, 3) : "--"}%`
              : "--"}
          </Typography>

          <Typography
            sx={{
              margin: "8px 0 0 0",
              fontSize: "12px",
            }}
          >
            {label
              ? `${dayjs(Number(label) * 1000).format(DAYJS_FORMAT)}`
              : aprCharts
              ? `${defaultAprData?.time ? dayjs(Number(defaultAprData.time) * 1000).format(DAYJS_FORMAT) : "--"}`
              : "--"}
          </Typography>
        </Box>

        <Box sx={{ margin: "32px 0 0 0" }}>
          <Box
            sx={{
              width: "100%",
              height: `240px`,
              display: "flex",
              flexDirection: "column",
              "> *": {
                fontSize: "1rem",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={422}
                height={240}
                data={chartData}
                margin={{
                  right: 20,
                }}
                onMouseLeave={() => {
                  setLabel(null);
                  setValue(null);
                }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis
                  dataKey="value"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={10}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <Tooltip
                  cursor={{ stroke: "#8572FF" }}
                  contentStyle={{ display: "none" }}
                  formatter={(value: number, name: string, props) => {
                    if (props && props.payload && props.payload.time) {
                      setLabel(props.payload.time);
                    }

                    if (props && props.payload && props.payload.value) {
                      setValue(props.payload.value);
                    }
                  }}
                />
                <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </MainCard>
    </Box>
  ) : null;
}
