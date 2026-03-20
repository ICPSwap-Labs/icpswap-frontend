import { type CurrencyAmount, Fraction, type Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";
import { NONE_PRICE_SYMBOL } from "constants/index";

export function formatCurrencyAmount(amount: CurrencyAmount<Token> | undefined, sigFigs: number | undefined | null) {
  if (!amount) {
    return NONE_PRICE_SYMBOL;
  }

  if (new BigNumber(amount.quotient.toString()).isEqualTo(0)) {
    return "0";
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return "<0.00001";
  }

  return amount.toFixed(sigFigs ? (sigFigs > 8 ? 8 : sigFigs) : 4, { groupSeparator: "," });
}
