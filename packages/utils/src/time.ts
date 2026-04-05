import { SECONDS_IN_DAY } from "@icpswap/constants";
import dayjs from "dayjs";

import { toDoubleNumber } from "./global";

/** Converts a duration in nanoseconds to milliseconds (integer division by 1e6). */
export function nanosecond2Millisecond(time: string | number | bigint) {
  return Number(BigInt(time) / BigInt(1000000));
}

/** Converts a duration in milliseconds to nanoseconds (multiplication by 1e6). */
export function millisecond2Nanosecond(time: string | number | bigint) {
  return Number(BigInt(time) * BigInt(1000000));
}

/**
 * Formats a millisecond timestamp with dayjs. Uses the first 13 characters of the string form (ms precision).
 * Returns an empty string when `timestamp` is falsy (note: `0` is treated as falsy).
 */
export function timestampFormat(timestamp: bigint | string | number, format = "YYYY-MM-DD HH:mm:ss"): string {
  if (!timestamp) return "";

  const newTimestamp = Number(String(timestamp).substr(0, 13));
  return dayjs(newTimestamp).format(format);
}

/** Converts a duration in seconds to a fractional number of days (using {@link SECONDS_IN_DAY}). */
export const secondsToDays = (seconds: number): number => seconds / SECONDS_IN_DAY;

/** Converts a number of days to seconds (rounded to the nearest integer). */
export const daysToSeconds = (days: number): number => Math.round(days * SECONDS_IN_DAY);

/** Converts a millisecond-based timestamp to Unix seconds (integer division by 1000). */
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

/**
 * Returns millisecond `{ start, end }` spanning the last `days` calendar-length periods (24h each),
 * anchored at `end` (defaults to `Date.now()`).
 */
export const getTimeRangeForPastDays = (days: number, end?: number) => {
  const now = end ?? Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;

  return {
    start,
    end: now,
  };
};
