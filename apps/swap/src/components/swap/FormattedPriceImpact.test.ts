import { Percent } from "@icpswap/swap-sdk";
import { describe, expect, it } from "vitest";
import FormattedPriceImpact from "./FormattedPriceImpact";

describe("FormattedPriceImpact", () => {
  it("shows an unfavourable impact as a positive percentage", () => {
    // Trade.priceImpact is positive for a loss: 0.30%
    expect(FormattedPriceImpact({ priceImpact: new Percent(300, 100_000) })).toBe("0.30%");
  });

  it("shows the magnitude of a negative impact without a minus sign", () => {
    expect(FormattedPriceImpact({ priceImpact: new Percent(-300, 100_000) })).toBe("0.30%");
  });

  it("falls back to 0.00% when there is no trade", () => {
    expect(FormattedPriceImpact({ priceImpact: undefined })).toBe("0.00%");
  });
});
