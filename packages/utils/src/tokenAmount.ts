import type { NumberType } from "@icpswap/types";
import BigNumber from "bignumber.js";

/**
 * Converts a human-readable token amount to the smallest units (multiplies by 10^decimals).
 * Non-numeric strings return a `BigNumber` built from the raw string (NaN path).
 */
export function formatTokenAmount(amount: NumberType | null | undefined, decimals: number | bigint = 8): BigNumber {
  let _amount = amount;
  let _decimals = decimals;

  if (_amount !== 0 && !_amount) return new BigNumber(0);
  if (typeof _amount === "bigint") _amount = Number(_amount);
  if (typeof decimals === "bigint") _decimals = Number(_decimals);
  if (Number.isNaN(Number(amount))) return new BigNumber(_amount);

  return new BigNumber(new BigNumber(_amount).multipliedBy(10 ** Number(_decimals)).toFixed(0));
}

/**
 * Converts smallest-unit amounts to a human-readable `BigNumber` (divides by 10^decimals).
 */
export function parseTokenAmount(amount: NumberType | null | undefined, decimals: number | bigint = 8): BigNumber {
  let _amount = amount;
  let _decimals = decimals;

  if (_amount !== 0 && !_amount) return new BigNumber(0);
  if (typeof _amount === "bigint") _amount = Number(_amount);
  if (typeof _decimals === "bigint") _decimals = Number(_decimals);
  if (Number.isNaN(Number(_amount))) return new BigNumber(String(_amount));

  return new BigNumber(String(_amount)).dividedBy(10 ** Number(_decimals));
}
