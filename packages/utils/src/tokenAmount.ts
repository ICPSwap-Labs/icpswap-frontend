import BigNumber from "bignumber.js";
import type { NumberType } from "@icpswap/types";

export function formatTokenAmount(
  amount: NumberType | null | undefined,
  decimals: number | bigint = 8
): BigNumber {
  let _amount = amount;
  let _decimals = decimals;

  if (_amount !== 0 && !_amount) return new BigNumber(0);
  if (typeof _amount === "bigint") _amount = Number(_amount);
  if (typeof decimals === "bigint") _decimals = Number(_decimals);
  if (Number.isNaN(Number(amount))) return new BigNumber(_amount);
  return new BigNumber(_amount).multipliedBy(10 ** Number(_decimals));
}

export function parseTokenAmount(
  amount: NumberType | null | undefined,
  decimals: number | bigint = 8
): BigNumber {
  if (amount !== 0 && !amount) return new BigNumber(0);
  if (typeof amount === "bigint") amount = Number(amount);
  if (typeof decimals === "bigint") decimals = Number(decimals);
  if (Number.isNaN(Number(amount))) return new BigNumber(String(amount));
  return new BigNumber(String(amount)).dividedBy(10 ** Number(decimals));
}
