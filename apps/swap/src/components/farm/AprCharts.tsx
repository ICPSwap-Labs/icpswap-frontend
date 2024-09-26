import { Box, Typography, useTheme } from "components/Mui";
import { Flex, MainCard } from "components/index";
import { Trans } from "@lingui/macro";
import { useFarmAprCharts } from "@icpswap/hooks";
import { Tooltip as Tip } from "@icpswap/ui";
import { BigNumber } from "@icpswap/utils";

import { useMemo, useState } from "react";
import { ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { darken } from "polished";

// format dayjs with the libraries that we need
dayjs.extend(utc);

const DAYJS_FORMAT = "MMM D, YYYY HH:mm:ss";

export interface FarmAprChartsProps {
  farmId: string | undefined;
}

export function FarmAprCharts({ farmId }: FarmAprChartsProps) {
  const [value, setValue] = useState<null | number>(null);
  const [label, setLabel] = useState<null | string>(null);

  const { result: aprCharts } = useFarmAprCharts(farmId);

  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!aprCharts) return undefined;

    return aprCharts.map((e) => ({ time: e[0].toString(), value: e[1] }));
  }, [aprCharts]);

  const color = "#5669dc";

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
          <Flex gap="0 6px">
            <Typography fontSize="16px">
              <Trans>APR</Trans>
            </Typography>

            <Tip
              tips={
                <Trans>
                  This APR updates every 10 minutes, so it may differ slightly from the real-time APR shown on the
                  right.
                </Trans>
              }
              iconSize="14px"
            />
          </Flex>

          <Typography
            sx={{
              margin: "12px 0 0 0",
              fontSize: "32px",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {value
              ? `${new BigNumber(value).toFixed(2)}%`
              : aprCharts
              ? `${new BigNumber(aprCharts[aprCharts.length - 1][1]).toFixed(2)}%`
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
              ? `${dayjs(Number(aprCharts[aprCharts.length - 1][0]) * 1000).format(DAYJS_FORMAT)}`
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
