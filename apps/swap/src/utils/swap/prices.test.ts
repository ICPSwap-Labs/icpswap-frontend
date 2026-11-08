import type { TradeType } from "@icpswap/constants";
import { Percent, type Token, type Trade } from "@icpswap/swap-sdk";
import { describe, expect, it } from "vitest";
import { computeRealizedLPFeePercent, computeRealizedPriceImpact, warningSeverity } from "./prices";

type FakeTrade = Trade<Token, Token, TradeType>;

/**
 * Builds the minimal shape the price impact helpers read:
 * `swaps[].route.pools[].fee`, `swaps[].inputAmount` (its share of `trade.inputAmount`) and
 * `priceImpact`. Every swap is assumed to carry an equal share of the trade input.
 */
function fakeTrade(feesPerSwap: number[][], priceImpact = new Percent(0, 100)): FakeTrade {
  const share = String(feesPerSwap.length);

  return {
    priceImpact,
    inputAmount: {},
    swaps: feesPerSwap.map((fees) => ({
      route: { pools: fees.map((fee) => ({ fee })) },
      inputAmount: { divide: () => ({ numerator: "1", denominator: share }) },
    })),
  } as unknown as FakeTrade;
}

describe("computeRealizedLPFeePercent", () => {
  it("compounds the fee of every hop", () => {
    // 1 - (1 - 0.3%) * (1 - 0.05%) = 0.34985%
    expect(computeRealizedLPFeePercent(fakeTrade([[3000, 500]])).toFixed(6)).toBe(
      new Percent(34985, 10_000_000).toFixed(6),
    );
  });

  it("weights each swap by its share of the input (split routes)", () => {
    // 1/2 * 0.3% + 1/2 * 0.05% = 0.175%
    expect(computeRealizedLPFeePercent(fakeTrade([[3000], [500]])).toFixed(6)).toBe(
      new Percent(175, 100_000).toFixed(6),
    );
  });
});

describe("computeRealizedPriceImpact", () => {
  it("subtracts the LP fee from the mid-price based impact", () => {
    // -5% - 0.3% = -5.3%
    expect(computeRealizedPriceImpact(fakeTrade([[3000]], new Percent(-500, 10_000))).toFixed(6)).toBe(
      new Percent(-530, 10_000).toFixed(6),
    );
  });
});

describe("warningSeverity", () => {
  it("does not warn for a favorable price (negative impact)", () => {
    expect(warningSeverity(new Percent(-500, 10_000))).toBe(0);
    expect(warningSeverity(new Percent(-50, 100))).toBe(0);
  });

  it("maps the impact to the 0-4 severity tiers", () => {
    expect(warningSeverity(undefined)).toBe(0);
    expect(warningSeverity(new Percent(50, 10_000))).toBe(0); // 0.5%
    expect(warningSeverity(new Percent(100, 10_000))).toBe(0); // 1% is not "more than low"
    expect(warningSeverity(new Percent(110, 10_000))).toBe(1); // 1.1%
    expect(warningSeverity(new Percent(400, 10_000))).toBe(2); // 4%
    expect(warningSeverity(new Percent(600, 10_000))).toBe(3); // 6%
    expect(warningSeverity(new Percent(2000, 10_000))).toBe(4); // 20%
  });
});
