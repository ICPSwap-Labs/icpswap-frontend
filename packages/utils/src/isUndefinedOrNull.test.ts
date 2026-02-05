import { describe, it, expect } from "vitest";
import { isUndefinedOrNull, nonUndefinedOrNull, isUndefinedOrNullOrEmpty } from "./isUndefinedOrNull";

describe("isUndefinedOrNull", () => {
  it("returns true for null and undefined", () => {
    expect(isUndefinedOrNull(null)).toBe(true);
    expect(isUndefinedOrNull(undefined)).toBe(true);
  });

  it("returns false for other values", () => {
    expect(isUndefinedOrNull(0)).toBe(false);
    expect(isUndefinedOrNull("")).toBe(false);
    expect(isUndefinedOrNull(false)).toBe(false);
  });
});

describe("nonUndefinedOrNull", () => {
  it("returns false for null and undefined", () => {
    expect(nonUndefinedOrNull(null)).toBe(false);
    expect(nonUndefinedOrNull(undefined)).toBe(false);
  });

  it("returns true for other values", () => {
    expect(nonUndefinedOrNull(0)).toBe(true);
    expect(nonUndefinedOrNull("")).toBe(true);
  });
});

describe("isUndefinedOrNullOrEmpty", () => {
  it("returns true for null, undefined and empty string", () => {
    expect(isUndefinedOrNullOrEmpty(null)).toBe(true);
    expect(isUndefinedOrNullOrEmpty(undefined)).toBe(true);
    expect(isUndefinedOrNullOrEmpty("")).toBe(true);
  });

  it("returns false for non-empty values", () => {
    expect(isUndefinedOrNullOrEmpty("a")).toBe(false);
    expect(isUndefinedOrNullOrEmpty(0)).toBe(false);
  });
});
