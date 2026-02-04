import { describe, it, expect } from "vitest";
import { isPrincipal } from "./isPrincipal";

describe("isPrincipal", () => {
  it("returns true for object with _isPrincipal", () => {
    expect(isPrincipal({ _isPrincipal: true })).toBe(true);
  });

  it("returns false for null/undefined", () => {
    expect(isPrincipal(null)).toBe(false);
    expect(isPrincipal(undefined)).toBe(false);
  });

  it("returns false for object without _isPrincipal", () => {
    expect(isPrincipal({})).toBe(false);
  });
});
