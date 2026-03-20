import { CurrencyAmount, type Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";
import { SAFE_DECIMALS_LENGTH, SAFE_INTEGER_LENGTH } from "constants/index";

export function tryParseAmount<T extends Token>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = new BigNumber(value)
      .multipliedBy(10 ** currency.decimals)
      .toFormat({ groupSeparator: "" });

    if (typedValueParsed !== "0") {
      return CurrencyAmount.fromRawAmount(currency, typedValueParsed);
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.error(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
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

export * from "./getPositionFeeKey";
export * from "./limit-order";
export * from "./liquidity";
export * from "./maxAmountFormat";
export * from "./maxAmountSpend";
export * from "./mint";
export * from "./sortToken";
