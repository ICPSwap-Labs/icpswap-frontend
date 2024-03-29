import { Price, CurrencyAmount, Token, Fraction } from "@icpswap/swap-sdk";
import { JSBI } from "utils/index";
import { NONE_PRICE_SYMBOL } from "constants/index";

export function formatCurrencyAmount(amount: CurrencyAmount<Token> | undefined, sigFigs: number | undefined | null) {
  if (!amount) {
    return NONE_PRICE_SYMBOL;
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return "0";
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return "<0.00001";
  }

  return amount.toFixed(sigFigs ? (sigFigs > 8 ? 8 : sigFigs) : 4, { groupSeparator: "," });
}

export function formatPrice(price: Price<Token, Token> | undefined, sigFigs: number) {
  if (!price) {
    return "-";
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return "<0.0001";
  }

  return price.toSignificant(sigFigs);
}
