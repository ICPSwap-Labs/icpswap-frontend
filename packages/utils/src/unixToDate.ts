import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/** Formats a Unix timestamp (seconds) as UTC with dayjs. */
export function unixToDate(unix: number, format = "YYYY-MM-DD"): string {
  return dayjs.unix(unix).utc().format(format);
}
