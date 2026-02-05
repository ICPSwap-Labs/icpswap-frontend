import { describe, it, expect } from "vitest";
import { feeAmountToPercent } from "./feeAmountToPercent";

describe("feeAmountToPercent", () => {
  it("converts fee amount to percentage string", () => {
    expect(feeAmountToPercent(100)).toBe("0.01%");
    expect(feeAmountToPercent(500)).toBe("0.05%");
  });

  it("accepts string input", () => {
    expect(feeAmountToPercent("300")).toBe("0.03%");
  });
});
