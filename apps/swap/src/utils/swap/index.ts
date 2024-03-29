import { BigintIsh, Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { JSBI } from "utils/index";
import { SAFE_INTEGER_LENGTH, SAFE_DECIMALS_LENGTH } from "constants/index";
import BigNumber from "bignumber.js";

export function tryParseAmount<T extends Token>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = new BigNumber(value)
      .multipliedBy(10 ** currency.decimals)
      .toFormat({ groupSeparator: "" });

    if (typedValueParsed !== "0") {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.error(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export function toHex(bigintIsh: BigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

export function feeAmountToPercentage(feeAmount: number | string): string {
  return `${new BigNumber(feeAmount).div(10000).toFixed(2)}%`;
}

export function inputNumberCheck(num: string | number): boolean {
  const integer = String(num).split(".")[0];
  const decimal = String(num).split(".")[1];

  if (decimal && decimal.length > SAFE_DECIMALS_LENGTH) {
    return false;
  }

  if (integer && integer.length > SAFE_INTEGER_LENGTH) {
    return false;
  }

  return true;
}

export * from "./maxAmountFormat";
export * from "./maxAmountSpend";
export * from "./sortToken";
