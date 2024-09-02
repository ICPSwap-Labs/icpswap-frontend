import { BigNumber } from "./bignumber";

export const formatPercentage = (value: number | string | bigint, options?: { fraction: number }) => {
  const { fraction = 2 } = options || {};
  return `${new BigNumber(Number(value) / 10000).toFixed(fraction)}%`;
};
