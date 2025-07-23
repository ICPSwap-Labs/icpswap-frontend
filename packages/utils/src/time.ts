import dayjs from "dayjs";
import { SECONDS_IN_DAY } from "@icpswap/constants";

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
  return parseInt(String(Number(timestamp) / 1000));
};

export const toStartTimeOfDay = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const mouth = toDoubleNumber(date.getMonth() + 1);
  const day = toDoubleNumber(date.getDate());

  return new Date(`${year}-${mouth}-${day}T00:00:00`).getTime();
};

export const toEndTimeOfDay = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const mouth = toDoubleNumber(date.getMonth() + 1);
  const day = toDoubleNumber(date.getDate());

  return new Date(`${year}-${mouth}-${day}T23:59:59`).getTime();
};
