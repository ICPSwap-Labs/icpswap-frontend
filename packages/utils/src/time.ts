import { SECONDS_IN_DAY } from "@icpswap/constants";
import dayjs from "dayjs";

import { toDoubleNumber } from "./global";

export function nanosecond2Millisecond(time: string | number | bigint) {
  return Number(BigInt(time) / BigInt(1000000));
}

export function millisecond2Nanosecond(time: string | number | bigint) {
  return Number(BigInt(time) * BigInt(1000000));
}

export function timestampFormat(timestamp: bigint | string | number, format = "YYYY-MM-DD HH:mm:ss"): string {
  if (!timestamp) return "";

  const newTimestamp = Number(String(timestamp).substr(0, 13));
  return dayjs(newTimestamp).format(format);
}

export const secondsToDays = (seconds: number): number => seconds / SECONDS_IN_DAY;
export const daysToSeconds = (days: number): number => Math.round(days * SECONDS_IN_DAY);

export const toUnixTimestamp = (timestamp: string | number) => {
  return parseInt(String(Number(timestamp) / 1000), 10);
};

/** Milliseconds at 00:00:00 local time for the calendar day of `timestamp`. */
export const getLocalDayStartMs = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const mouth = toDoubleNumber(date.getMonth() + 1);
  const day = toDoubleNumber(date.getDate());

  return new Date(`${year}-${mouth}-${day}T00:00:00`).getTime();
};

/** Milliseconds at 23:59:59 local time for the calendar day of `timestamp`. */
export const getLocalDayEndMs = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const mouth = toDoubleNumber(date.getMonth() + 1);
  const day = toDoubleNumber(date.getDate());

  return new Date(`${year}-${mouth}-${day}T23:59:59`).getTime();
};

/** Millisecond `{ startTime, endTime }` for the last `days` days, ending at `end` (default: now). */
export const getTimeRangeForPastDays = (days: number, end?: number) => {
  const now = end ?? Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;

  return {
    start,
    end: now,
  };
};
