import React, { Dispatch, SetStateAction, ReactNode } from "react";
import { BarChart, ResponsiveContainer, XAxis, Tooltip, Bar } from "recharts";
import { Box } from "@mui/material";
import { GridRowBetween } from "ui-component/index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { VolumeWindow } from "types/analytic";

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
  activeWindow?: VolumeWindow;
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
  tickFormat?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}) => {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  );
};

export default function Chart({
  data,
  color = "#5669dc",
  setValue,
  setLabel,
  value,
  label,
  activeWindow,
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

  const now = dayjs();

  return (
    <Box
      sx={{
        width: "100%",
        height: `${DEFAULT_HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        minHeight,
        "> *": {
          fontSize: "1rem",
        },
      }}
      {...rest}
    >
      <GridRowBetween align="flex-start">
        {topLeft ?? null}
        {topRight ?? null}
      </GridRowBetween>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            if (setLabel) setLabel(undefined);
            if (setValue) setValue(undefined);
          }}
        >
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tickFormatter={(time) => dayjs(time).format(activeWindow === VolumeWindow.monthly ? "MMM" : tickFormat)}
            minTickGap={10}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip
            cursor={{ fill: "#29314F" }}
            contentStyle={{ display: "none" }}
            // @ts-ignore
            formatter={(value: number, name: string, props: { payload: { time: string; value: number } }) => {
              if (setValue && parsedValue !== props.payload.value) {
                setValue(props.payload.value);
              }
              const formattedTime = dayjs(props.payload.time).format("MMM D");
              const formattedTimeDaily = dayjs(props.payload.time).format("MMM D YYYY");
              const formattedTimePlusWeek = dayjs(props.payload.time).add(1, "week");
              const formattedTimePlusMonth = dayjs(props.payload.time).add(1, "month");

              if (setLabel && label !== formattedTime) {
                if (activeWindow === VolumeWindow.weekly) {
                  const isCurrent = formattedTimePlusWeek.isAfter(now);
                  setLabel(`${formattedTime}-${isCurrent ? "current" : formattedTimePlusWeek.format("MMM D, YYYY")}`);
                } else if (activeWindow === VolumeWindow.monthly) {
                  const isCurrent = formattedTimePlusMonth.isAfter(now);
                  setLabel(`${formattedTime}-${isCurrent ? "current" : formattedTimePlusMonth.format("MMM D, YYYY")}`);
                } else {
                  setLabel(formattedTimeDaily);
                }
              }
            }}
          />
          <Bar
            dataKey="value"
            fill={color}
            shape={(props: any) => {
              return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <GridRowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </GridRowBetween>
    </Box>
  );
}
