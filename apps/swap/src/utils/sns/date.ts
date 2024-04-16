import { SECONDS_IN_YEAR, SECONDS_IN_MONTH, SECONDS_IN_DAY } from "@icpswap/constants";

type LabelKey = "year" | "month" | "day" | "hour" | "minute" | "second";
type LabelInfo = {
  labelKey: LabelKey;
  amount: number;
};
const createLabel = (labelKey: LabelKey, amount: bigint): LabelInfo => ({
  labelKey,
  amount: Number(amount),
});

export const secondsToDissolveDelayDuration = (seconds: bigint): string => {
  const years = seconds / BigInt(SECONDS_IN_YEAR);
  const months = (seconds % BigInt(SECONDS_IN_YEAR)) / BigInt(SECONDS_IN_MONTH);
  const days = BigInt(Math.ceil((Number(seconds) % SECONDS_IN_MONTH) / SECONDS_IN_DAY));
  const periods = [createLabel("year", years), createLabel("month", months), createLabel("day", days)];

  return periods
    .filter(({ amount }) => amount > 0)
    .map((labelInfo) => `${labelInfo.amount} ${labelInfo.labelKey}`)
    .join(", ");
};
