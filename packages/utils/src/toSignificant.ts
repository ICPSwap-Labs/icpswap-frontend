import _Decimal from "decimal.js-light";
import _Big from "big.js";
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

export function toSignificant(
  num: number | string,
  significantDigits = 6,
  format: object = { groupSeparator: "" },
  rounding: Rounding = Rounding.ROUND_HALF_UP,
): string {
  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[rounding],
  });

  const quotient = new Decimal(num).toSignificantDigits(significantDigits);
  return quotient.toFormat(quotient.decimalPlaces(), format);
}

export function toSignificantWithGroupSeparator(num: number | string, significantDigits = 6): string {
  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[Rounding.ROUND_DOWN],
  });

  const quotient = new Decimal(num).toSignificantDigits(significantDigits);
  return quotient.toFormat(quotient.decimalPlaces(), { groupSeparator: "," });
}
