import { describe, it, expect } from "vitest";
import { BigNumber } from "./bignumber";

describe("bignumber", () => {
  it("exports BigNumber with ROUND_DOWN config", () => {
    const bn = new BigNumber(1.5);
    expect(bn.toFixed(0)).toBe("1");
  });

  it("handles basic arithmetic", () => {
    expect(new BigNumber(10).plus(5).toNumber()).toBe(15);
    expect(new BigNumber(10).minus(3).toNumber()).toBe(7);
  });
});
