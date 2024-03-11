import JSBI from "jsbi";
import { TradeType } from "@icpswap/constants";
import { Currency, CurrencyAmount, Fraction, Percent, Trade } from "@icpswap/swap-sdk";
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from "constants/misc";

const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000));

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(trade: Trade<Currency, Currency, TradeType>): Percent {
  const percent: Percent = ONE_HUNDRED_PERCENT.subtract(
    trade.route.pools.reduce<Percent>(
      (currentFee: Percent, pool): Percent =>
        currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(pool.fee, 1_000_000))),
      ONE_HUNDRED_PERCENT,
    ),
  );

  return new Percent(percent.numerator, percent.denominator);
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(
  trade?: Trade<Currency, Currency, TradeType> | null,
): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercent(trade);

    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient);
  }

  return undefined;
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
];

type WarningSeverity = 0 | 1 | 2 | 3 | 4;
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 4;
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity;
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact;
    impact--;
  }
  return 0;
}
