import { BigNumber } from "./bignumber";

export const formatPercentage = (value: number, options?: { fraction: number }) => {
  const { fraction = 3 } = options || {};
  return `${new BigNumber(value * 100).toFixed(fraction)}%`;
};
