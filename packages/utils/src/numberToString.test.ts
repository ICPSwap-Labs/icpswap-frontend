import { describe, it, expect } from "vitest";
import { numberToString, bigNumberToString } from "./numberToString";
import BigNumber from "bignumber.js";

describe("numberToString", () => {
  it("returns 0 for zero", () => {
    expect(numberToString(0)).toBe("0");
    expect(numberToString(BigInt(0))).toBe("0");
  });

  it("formats number without group separator", () => {
    expect(numberToString(1234567)).toBe("1234567");
  });

  it("returns empty string for falsy non-zero", () => {
    expect(numberToString(null as any)).toBe("");
  });
});

describe("bigNumberToString", () => {
  it("formats BigNumber without group separator", () => {
    expect(bigNumberToString(new BigNumber(1234567))).toBe("1234567");
  });
});
