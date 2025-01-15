import { Null } from "@icpswap/types";

import { BigNumber } from "./bignumber";
import { toSignificant, toSignificantWithGroupSeparator } from "./toSignificant";
import { isNullArgs, nonNullArgs } from "./isNullArgs";

function removeUselessZeroes(number: string) {
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  return number.replace(regexp, "$1");
}

// Function to transform decimal trailing zeroes to exponent
function decimalTrailingZeroesToExponent(formattedCurrency: string, maximumDecimalTrailingZeroes: number): string {
  const decimalTrailingZeroesPattern = new RegExp(`(\\.|,)(0{${maximumDecimalTrailingZeroes + 1},})(?=[1-9]?)`);
  return formattedCurrency.replace(
    decimalTrailingZeroesPattern,
    (_match, separator, decimalTrailingZeroes) => `${separator}0{${decimalTrailingZeroes.length}}`,
  );
  // return formattedCurrency.replace(
  //   decimalTrailingZeroesPattern,
  //   (_match, separator, decimalTrailingZeroes) => `${separator}0${toSubscript(decimalTrailingZeroes.length)}`,
  // );
}

// const subscriptNumbers: string[] = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
// function toSubscript(number: number): string {
//   return number
//     .toString()
//     .split("")
//     .map((digit) => subscriptNumbers[parseInt(digit, 10)])
//     .join("");
// }

export interface FormatDollarAmountOptions {
  digits?: number;
  min?: number;
  max?: number;
}

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | string | undefined, options?: FormatDollarAmountOptions) => {
  const { digits = 2, min = 0.01, max = 1000 } = options ?? {};

  if (isNullArgs(num)) return "-";
  if (new BigNumber(num).isEqualTo(0)) return "$0.00";

  if (new BigNumber(num).isLessThan(min)) {
    return `<$${min}`;
  }

  if (new BigNumber(num).isLessThan(max)) {
    return `$${new BigNumber(num).toFixed(digits)}`;
  }

  return `$${Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num))}`;
};

export interface FormatDollarTokenPriceOptions {
  digits?: number;
  min?: number;
  decimalTrailingZero?: number;
}

// using a currency library here in case we want to add more in future
export const formatDollarTokenPrice = (num: number | string | Null, options?: FormatDollarTokenPriceOptions) => {
  const { digits = 3, min, decimalTrailingZero = 3 } = options ?? {};

  const __num = num;

  if (isNullArgs(num)) return "-";
  if (new BigNumber(__num).isEqualTo(0)) return "$0.00";

  if (nonNullArgs(min) && new BigNumber(__num).isLessThan(min)) {
    return `<$${min}`;
  }

  if (new BigNumber(__num).isLessThan(1)) {
    if (new BigNumber(__num).isLessThan(1 / 10 ** decimalTrailingZero)) {
      return `$${decimalTrailingZeroesToExponent(toSignificant(__num, decimalTrailingZero), decimalTrailingZero - 1)}`;
    }

    return `$${toSignificant(__num, digits)}`;
  }

  return `$${new BigNumber(__num).toFormat(2)}`;
};

export interface FormatAmountOptions {
  digits?: number;
  min?: number;
  max?: number;
  fullNumber?: boolean;
  fullDigits?: number;
}

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | string | Null, options?: FormatAmountOptions) => {
  const { digits = 5, min = 0.00001, max = 1000, fullNumber, fullDigits = 5 } = options ?? {};

  if (isNullArgs(num)) return "-";
  if (new BigNumber(num).isEqualTo(0)) return "$0.00";

  if (fullNumber) {
    return new BigNumber(num).toFormat(fullDigits);
  }

  if (new BigNumber(num).isLessThan(min)) {
    return `<${min}`;
  }

  if (new BigNumber(num).isLessThan(max)) {
    return removeUselessZeroes(new BigNumber(num).toFixed(digits));
  }

  return Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num));
};

export interface FormatTokenPriceProps {
  digits?: number;
  digitsIfLessThanOne?: number;
  min?: number;
  max?: number;
}

// using a currency library here in case we want to add more in future
export function formatTokenPrice(num: number | string | Null, options?: FormatTokenPriceProps) {
  const { digits = 6, min = 0.00001, digitsIfLessThanOne = 5, max = 1000000 } = options ?? {};

  if (isNullArgs(num)) return "-";
  if (new BigNumber(num).isEqualTo(0)) return "$0.00";

  if (new BigNumber(num).isLessThan(min)) {
    return `<${min}`;
  }

  if (new BigNumber(num).isLessThan(1)) {
    return removeUselessZeroes(new BigNumber(num).toFixed(digitsIfLessThanOne));
  }

  if (new BigNumber(num).isLessThan(max)) {
    return toSignificantWithGroupSeparator(num, digits);
  }

  return new BigNumber(num).toFixed(0);
}

export interface FormatIcpAmountOptions {
  digits?: number;
  min?: number;
  max?: number;
}

// using a currency library here in case we want to add more in future
export const formatIcpAmount = (num: number | string | Null, options?: FormatIcpAmountOptions) => {
  const { digits = 2, min = 0.01, max = 1000 } = options ?? {};

  if (isNullArgs(num)) return "-";
  if (new BigNumber(num).isEqualTo(0)) return "$0.00";

  if (new BigNumber(num).isLessThan(min)) {
    return `<${min}`;
  }

  if (new BigNumber(num).isLessThan(max)) {
    return new BigNumber(num).toFormat(digits);
  }

  return Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num));
};

// Format the number of liquidity token amount
export function formatLiquidityAmount(num: number | string | Null) {
  if (isNullArgs(num)) return "-";
  if (new BigNumber(num).isEqualTo(0)) return "$0.00";

  if (new BigNumber(num).isLessThan(1)) {
    return toSignificantWithGroupSeparator(num, 3);
  }

  const __num = new BigNumber(num).toFormat(5);

  const regexp = /(?:\.0*|(\.\d+?)0+)$/;

  return __num.replace(regexp, "$1");
}

export function percentToNum(val: string) {
  return new BigNumber(val.replace("%", "")).dividedBy(100).toNumber();
}

export function numToPercent(num: string | number | BigNumber, digits?: number) {
  return digits || digits === 0
    ? `${new BigNumber(num).multipliedBy(100).toFixed(digits)}%`
    : `${new BigNumber(num).multipliedBy(100).toString()}%`;
}
