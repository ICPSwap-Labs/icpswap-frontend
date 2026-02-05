import { describe, it, expect } from "vitest";
import { isAvailablePageArgs } from "./isAvailablePageArgs";

describe("isAvailablePageArgs", () => {
  it("returns true when offset and limit are valid", () => {
    expect(isAvailablePageArgs(0, 10)).toBe(true);
    expect(isAvailablePageArgs(1, 5)).toBe(true);
  });

  it("returns false when limit is falsy", () => {
    expect(isAvailablePageArgs(0, 0)).toBe(false);
    expect(isAvailablePageArgs(1, undefined as any)).toBe(false);
  });

  it("returns true when offset is 0", () => {
    expect(isAvailablePageArgs(0, 10)).toBe(true);
  });
});
