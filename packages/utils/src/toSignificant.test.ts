import { describe, it, expect } from "vitest";
import { toSignificant, toSignificantWithGroupSeparator } from "./toSignificant";

describe("toSignificant", () => {
  it("formats to significant digits", () => {
    expect(toSignificant(1.234567, 4)).toBe("1.234");
  });
});

describe("toSignificantWithGroupSeparator", () => {
  it("formats with comma group separator", () => {
    const result = toSignificantWithGroupSeparator(1234.56, 6);
    expect(result).toContain(",");
  });
});
