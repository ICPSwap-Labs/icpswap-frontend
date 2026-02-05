import { describe, it, expect } from "vitest";
import { calcPoolFees } from "./fee24h";

describe("calcPoolFees", () => {
  it("returns 0.3% of volumeUSD", () => {
    expect(calcPoolFees(1000)).toBe(3);
    expect(calcPoolFees(10000)).toBe(30);
  });

  it("accepts string", () => {
    expect(calcPoolFees("1000")).toBe(3);
  });

  it("returns undefined for falsy volumeUSD", () => {
    expect(calcPoolFees(undefined)).toBeUndefined();
    expect(calcPoolFees(0)).toBe(0);
  });
});
