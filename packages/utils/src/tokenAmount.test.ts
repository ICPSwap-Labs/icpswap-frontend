import { describe, it, expect } from "vitest";
import { formatTokenAmount, parseTokenAmount } from "./tokenAmount";

describe("formatTokenAmount", () => {
  it("formats amount with decimals", () => {
    const result = formatTokenAmount(1, 8);
    expect(result.toFixed()).toBe("100000000");
  });

  it("returns zero for null/undefined", () => {
    expect(formatTokenAmount(null).toNumber()).toBe(0);
    expect(formatTokenAmount(undefined).toNumber()).toBe(0);
  });
});

describe("parseTokenAmount", () => {
  it("parses amount with decimals", () => {
    const result = parseTokenAmount(100000000, 8);
    expect(result.toNumber()).toBe(1);
  });

  it("returns zero for null/undefined", () => {
    expect(parseTokenAmount(null).toNumber()).toBe(0);
  });
});
