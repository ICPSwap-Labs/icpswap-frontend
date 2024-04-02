import JSBI from "jsbi";
import { Price, Token, CurrencyAmount, Fraction } from "../core";

export function formatCurrencyAmount(amount: CurrencyAmount<Token> | undefined, sigFigs: number) {
  if (!amount) return "--";

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return "0";
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return "<0.00001";
  }

  return amount.toFixed(sigFigs ? (sigFigs > 8 ? 8 : sigFigs) : 4, { groupSeparator: "," });
}

export function formatPrice(price: Price<Token, Token> | undefined, sigFigs: number, format?: object) {
  if (!price) {
    return "-";
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return "<0.0001";
  }

  return price.toSignificant(sigFigs, format);
}

enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export function formatTickPrice(
  price: Price<Token, Token> | undefined,
  atLimit: { [bound in Bound]?: boolean | undefined },
  direction: Bound,
  placeholder?: string,
  format?: object,
) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? "0" : "∞";
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatPrice(price, 5, format);
}
