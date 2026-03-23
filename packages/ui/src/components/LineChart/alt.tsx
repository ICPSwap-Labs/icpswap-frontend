import dayjs from "dayjs";
import { darken } from "polished";
import type React from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GridRowBetween } from "../Grid/Row";
import { Box, useTheme } from "../Mui";

export type LineChartAltProps = {
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
  showXAxis?: boolean;
  showYAxis?: boolean;
  xTickFormatter?: (val: string) => string;
  yTickFormatter?: (val: string) => string;
  tipFormat?: string;
  extraNode?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function LineChartAlt({
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
  minHeight = 300,
  tickFormat = "DD",
  showXAxis = true,
  showYAxis = false,
  xTickFormatter,
  yTickFormatter,
  tipFormat = "MMM D, YYYY",
  extraNode,
  height,
  ...rest
}: LineChartAltProps) {
  const theme = useTheme();
  const parsedValue = value;

  return (
    <Box
      sx={{
        width: "100%",
        height: `${minHeight}px`,
        display: "flex",
        minHeight,
        flexDirection: "column",
        "> *": {
          fontSize: "1rem",
        },
      }}
      {...rest}
    >
      <GridRowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </GridRowBetween>

      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
          onMouseLeave={() => {
            if (setLabel) setLabel(undefined);
            if (setValue) setValue(undefined);
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {showXAxis ? (
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => {
                return xTickFormatter ? xTickFormatter(val) : dayjs(val).format(tickFormat);
              }}
              minTickGap={15}
              tick={{ fill: theme.palette.text.secondary }}
            />
          ) : null}

          {showYAxis ? (
            <YAxis
              dataKey="value"
              axisLine={false}
              tickFormatter={yTickFormatter ? (value) => yTickFormatter(value) : null}
              tickLine={false}
              minTickGap={10}
              tick={{ fill: theme.palette.text.secondary, fontSize: "12px" }}
            />
          ) : null}

          <Tooltip
            cursor={{ stroke: "#8572FF" }}
            contentStyle={{ display: "none" }}
            formatter={(value: number, _name: string, props: { payload: { time: string; value: number } }) => {
              if (setValue && parsedValue !== props.payload.value) {
                setValue(props.payload.value);
              }
              const formattedTime = dayjs(props.payload.time).format(tipFormat);
              if (setLabel && label !== formattedTime) setLabel(formattedTime);

              return value;
            }}
          />

          <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />

          {extraNode || null}
        </AreaChart>
      </ResponsiveContainer>

      <GridRowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </GridRowBetween>
    </Box>
  );
}
