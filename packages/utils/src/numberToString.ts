import BigNumber from "bignumber.js";

/** Formats a number without a group separator; `0` and `BigInt(0)` yield `"0"`. */
export function numberToString(num: number | bigint | BigNumber): string {
  if (num === 0 || num === BigInt(0)) return "0";
  if (num)
    return new BigNumber(typeof num === "bigint" ? String(num) : num).toFormat({
      groupSeparator: "",
    });
  return "";
}

/** Formats a `BigNumber` without a group separator (integer-style grouping disabled). */
export function bigNumberToString(num: BigNumber): string {
  return num.toFormat({
    groupSeparator: "",
  });
}
