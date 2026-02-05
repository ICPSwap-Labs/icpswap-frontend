import { describe, it, expect } from "vitest";
import { isValidAccount, ICP_ADDRESS_LENGTH } from "./isValidAccount";

describe("isValidAccount", () => {
  it("returns true for 64-char hex string", () => {
    const valid = "a".repeat(64);
    expect(isValidAccount(valid)).toBe(true);
    expect(isValidAccount("0123456789abcdef".repeat(4))).toBe(true);
  });

  it("returns false for wrong length", () => {
    expect(isValidAccount("a".repeat(63))).toBe(false);
    expect(isValidAccount("a".repeat(65))).toBe(false);
  });

  it("returns false for non-hex characters", () => {
    expect(isValidAccount("g" + "a".repeat(63))).toBe(false);
  });

  it("exports ICP_ADDRESS_LENGTH as 64", () => {
    expect(ICP_ADDRESS_LENGTH).toBe(64);
  });
});
