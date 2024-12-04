import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);
