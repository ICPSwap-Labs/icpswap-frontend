import React, { Dispatch, SetStateAction, ReactNode } from "react";
import { ResponsiveContainer, XAxis, Tooltip, AreaChart, Area } from "recharts";
import { Box } from "@mui/material";
import { RowBetween } from "ui-component/Row";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { darken } from "polished";

dayjs.extend(utc);

const DEFAULT_HEIGHT = 300;

export type LineChartProps = {
  data: any[];
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>>; // used for label of valye
  value?: number;
  label?: string;
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
  tickFormat?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Chart({
  data,
  color = "#5669dc",
  value,
  label,
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  tickFormat = "DD",
  ...rest
}: LineChartProps) {
  const theme = useTheme() as Theme;
  const parsedValue = value;

  return (
    <Box
      sx={{
        width: "100%",
        height: `${DEFAULT_HEIGHT}px`,
        display: "flex",
        minHeight,
        flexDirection: "column",
        "> *": {
          fontSize: "1rem",
        },
      }}
      {...rest}
    >
      <RowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onMouseLeave={() => {
            setLabel && setLabel(undefined);
            setValue && setValue(undefined);
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tickFormatter={(time) => dayjs(time).format(tickFormat)}
            minTickGap={10}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip
            cursor={{ stroke: "#8572FF" }}
            contentStyle={{ display: "none" }}
            // @ts-ignore
            formatter={(value: number, name: string, props: { payload: { time: string; value: number } }) => {
              if (setValue && parsedValue !== props.payload.value) {
                setValue(props.payload.value);
              }
              const formattedTime = dayjs(props.payload.time).format("MMM D, YYYY");
              if (setLabel && label !== formattedTime) setLabel(formattedTime);
            }}
          />
          <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>

      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Box>
  );
}
