import { BigNumber } from "./bignumber";

/** Formats a fractional value (0–1) as a percent string with configurable decimal places (default 2). */
export const formatPercentage = (value: number | string | bigint, options?: { fraction: number }) => {
  const { fraction = 2 } = options || {};

  return `${new BigNumber(value.toString()).multipliedBy(100).toFixed(fraction)}%`;
};
