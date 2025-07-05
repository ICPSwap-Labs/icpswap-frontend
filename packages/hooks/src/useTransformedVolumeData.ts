/* eslint-disable no-case-declarations */
import { useMemo } from "react";
import { ChartDayVolumeData, GenericChartEntry } from "@icpswap/types";
import { BigNumber, unixToDate } from "@icpswap/utils";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayjs from "dayjs";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

function unixToType(unix: number, type: "month" | "week") {
  const date = dayjs.unix(unix).utc();

  switch (type) {
    case "month":
      return date.format("YYYY-MM");
    case "week":
      let week = String(date.week());
      if (week.length === 1) {
        week = `0${week}`;
      }
      return `${date.year()}-${week}`;
    default:
      break;
  }
}

export function useTransformedVolumeData(chartData: ChartDayVolumeData[] | undefined, type: "month" | "week") {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {};

      chartData.forEach(({ timestamp, volumeUSD }: { timestamp: number; volumeUSD: number }) => {
        const unixTimestamp = Number(new BigNumber(timestamp).dividedBy(1000).toFixed(0));

        const group = unixToType(unixTimestamp, type);

        if (group === undefined) return;

        if (data[group]) {
          data[group].value += volumeUSD;
        } else {
          data[group] = {
            time: unixToDate(unixTimestamp),
            value: volumeUSD,
          };
        }
      });

      return Object.values(data);
    }
    return [];
  }, [chartData, type]);
}
