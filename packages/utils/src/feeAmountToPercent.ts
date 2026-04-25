import { BigNumber } from "bignumber.js";

/** Converts fee units (per-million) to a percent string (divides by 10000). */
export function feeAmountToPercent(feeAmount: number | string): string {
  return `${new BigNumber(feeAmount).div(10000).toFixed(2)}%`;
}
