import _Decimal from "decimal.js-light";
import toFormat from "toformat";

enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

const Decimal = toFormat(_Decimal);

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};

/**
 * Formats a number to a fixed number of significant digits using decimal.js rounding.
 *
 * @param format - Passed to `toFormat` (e.g. `groupSeparator`).
 */
export function toSignificant(
  num: number | string,
  significantDigits = 6,
  format: object = { groupSeparator: "" },
  rounding: Rounding = Rounding.ROUND_DOWN,
): string {
  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[rounding],
  });

  const quotient = new Decimal(num).toSignificantDigits(significantDigits);
  return quotient.toFormat(quotient.decimalPlaces(), format);
}

/** Like {@link toSignificant} with thousands separated by commas and round-down semantics. */
export function toSignificantWithGroupSeparator(num: number | string, significantDigits = 6): string {
  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[Rounding.ROUND_DOWN],
  });

  const quotient = new Decimal(num).toSignificantDigits(significantDigits);
  return quotient.toFormat(quotient.decimalPlaces(), { groupSeparator: "," });
}
