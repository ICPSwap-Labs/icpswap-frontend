import { BigNumber } from "@icpswap/utils";

export function feeAmountPercent(fee: bigint | number | string) {
  return `${new BigNumber(fee.toString()).dividedBy(10000).toString()}%`;
}
