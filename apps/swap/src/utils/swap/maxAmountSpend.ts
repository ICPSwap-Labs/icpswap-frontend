import { Token, CurrencyAmount } from "@icpswap/swap-sdk";

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount<Token>): CurrencyAmount<Token> | undefined {
  if (!currencyAmount) return undefined;

  const maxAmountSubFee = currencyAmount.subtract(
    CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2),
  );

  return maxAmountSubFee;
}
