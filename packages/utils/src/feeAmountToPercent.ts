import { BigNumber } from "bignumber.js";

export function feeAmountToPercent(feeAmount: number | string): string {
  return `${new BigNumber(feeAmount).div(10000).toFixed(2)}%`;
}
