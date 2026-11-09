import { CurrencyAmount, Fraction, type Percent, type Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";

/** Warning threshold (percentage value): below 0.05% a swap reverts on any small price move. */
export const MIN_SLIPPAGE_WARNING = 0.05;

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
 * True when the slippage is too low, i.e. below {@link MIN_SLIPPAGE_WARNING} (0.05%): such a tight
 * tolerance makes the transaction revert on any small price movement.
 *
 * A high slippage (above 5%) is intentionally NOT warned about: it does not make the swap fail, it
 * only means a worse price may be accepted (fewer tokens received), which is the user's explicit
 * choice in the settings panel.
 *
 * The argument is a percentage number ("5" means 5%). Empty or invalid input never warns.
 */
export function isSlippageTooLow(value: string | number): boolean {
  if (value === "") return false;

  const percent = new BigNumber(value);
  if (!percent.isFinite()) return false;

  return percent.isLessThan(MIN_SLIPPAGE_WARNING);
}
