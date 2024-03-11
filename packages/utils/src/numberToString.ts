import BigNumber from "bignumber.js";

export function numberToString(num: number | bigint | BigNumber): string {
  if (num === 0 || num === BigInt(0)) return "0";
  if (num)
    return new BigNumber(typeof num === "bigint" ? String(num) : num).toFormat({
      groupSeparator: "",
    });
  return "";
}

/** Only Integer number */
export function bigNumberToString(num: BigNumber): string {
  return num.toFormat({
    groupSeparator: "",
  });
}
