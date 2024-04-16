import dayjs from "dayjs";

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
