import { describe, it, expect } from "vitest";
import { formatPercentage } from "./formatPercentage";

describe("formatPercentage", () => {
  it("formats number as percentage", () => {
    expect(formatPercentage(0.5)).toBe("50.00%");
    expect(formatPercentage(0.123)).toBe("12.30%");
  });

  it("accepts fraction option", () => {
    expect(formatPercentage(0.12345, { fraction: 4 })).toBe("12.3450%");
  });

  it("accepts string and bigint", () => {
    expect(formatPercentage("0.1")).toBe("10.00%");
    expect(formatPercentage(BigInt(0) as any)).toBe("0.00%");
  });
});
