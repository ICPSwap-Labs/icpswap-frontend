import { useMemo } from "react";
import { ChartDayVolumeData, GenericChartEntry } from "types/analytic";
import { unixToDate } from "utils/date";
import dayjs from "dayjs";

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
  }
}

export function useTransformedVolumeData(chartData: ChartDayVolumeData[] | undefined, type: "month" | "week") {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {};

      chartData.forEach(({ date, volumeUSD }: { date: number; volumeUSD: number }) => {
        const group = unixToType(date, type);
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
    } else {
      return [];
    }
  }, [chartData, type]);
}
