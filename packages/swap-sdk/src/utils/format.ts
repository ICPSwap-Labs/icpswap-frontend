import JSBI from "jsbi";
import { formatTokenPrice } from "@icpswap/utils";

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

enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export function formatTickPrice(
  price: Price<Token, Token> | undefined,
  atLimit: { [bound in Bound]?: boolean | undefined },
  direction: Bound,
  placeholder?: string,
) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? "0" : "∞";
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatTokenPrice(price?.toFixed(100));
}
