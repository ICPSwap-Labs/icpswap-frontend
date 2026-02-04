import { describe, it, expect } from "vitest";
import { isBigIntMemo } from "./isBigIntMemo";

describe("isBigIntMemo", () => {
  it("returns true for bigint", () => {
    expect(isBigIntMemo(BigInt(0))).toBe(true);
    expect(isBigIntMemo(BigInt(123))).toBe(true);
  });

  it("returns false for number array", () => {
    expect(isBigIntMemo([1, 2, 3])).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isBigIntMemo(undefined)).toBe(false);
  });
});
