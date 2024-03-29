import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function unixToDate(unix: number, format = "YYYY-MM-DD"): string {
  return dayjs.unix(unix).utc().format(format);
}
