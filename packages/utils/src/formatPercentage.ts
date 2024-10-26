import { BigNumber } from "./bignumber";

export const formatPercentage = (value: number | string | bigint, options?: { fraction: number }) => {
  const { fraction = 2 } = options || {};

  return `${new BigNumber(value.toString()).multipliedBy(100).toFixed(fraction)}%`;
};
