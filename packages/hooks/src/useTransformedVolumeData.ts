/* eslint-disable no-case-declarations */
import { useMemo } from "react";
import { ChartDayVolumeData, GenericChartEntry } from "@icpswap/types";
import { unixToDate } from "@icpswap/utils";
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

      chartData.forEach(({ date, volumeUSD }: { date: number; volumeUSD: number }) => {
        const group = unixToType(date, type);

        if (group === undefined) return;

        if (data[group]) {
          data[group].value += volumeUSD;
        } else {
          data[group] = {
            time: unixToDate(date),
            value: volumeUSD,
          };
        }
      });

      return Object.values(data);
    }
    return [];
  }, [chartData, type]);
}
