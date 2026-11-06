import { CurrencyAmount, Fraction, type Percent, type Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";

/** Slippage warning thresholds (percentage values): below 0.05% trades tend to fail, above 5% the execution price can drift badly. */
export const MIN_SLIPPAGE_WARNING = 0.05;
export const MAX_SLIPPAGE_WARNING = 5;

/**
 * Minimum amount out = amount out × (1 - slippage tolerance).
 *
 * Mirrors the slippage shown in the settings panel (0.5% slippage -> 99.5% of the amount out).
 * A slippage of 100% or more is treated as 0, so the result can never go negative.
 */
export function minimumAmountOutBySlippage<T extends Token>(
  amountOut: CurrencyAmount<T>,
  slippageTolerance: Percent,
): CurrencyAmount<T> {
  const remaining = new Fraction(1).subtract(slippageTolerance);
  if (remaining.lessThan(0)) return CurrencyAmount.fromRawAmount(amountOut.currency, 0);

  return CurrencyAmount.fromRawAmount(amountOut.currency, remaining.multiply(amountOut.quotient).quotient);
}

/**
 * Returns "low" when the slippage is below {@link MIN_SLIPPAGE_WARNING} (0.05%) and "high" when it is
 * above {@link MAX_SLIPPAGE_WARNING} (5%); otherwise returns null.
 *
 * The argument is a percentage number ("5" means 5%). Empty or invalid input never warns.
 */
export function getSlippageWarningLevel(value: string | number): "low" | "high" | null {
  if (value === "") return null;

  const percent = new BigNumber(value);
  if (!percent.isFinite()) return null;
  if (percent.isLessThan(MIN_SLIPPAGE_WARNING)) return "low";
  if (percent.isGreaterThan(MAX_SLIPPAGE_WARNING)) return "high";

  return null;
}
