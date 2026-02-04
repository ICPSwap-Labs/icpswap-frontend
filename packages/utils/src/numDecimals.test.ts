import { describe, it, expect } from "vitest";
import { getNumberDecimals } from "./numDecimals";

describe("getNumberDecimals", () => {
  it("returns decimal place count for string", () => {
    expect(getNumberDecimals("1.23")).toBe(2);
    expect(getNumberDecimals("1.12345")).toBe(5);
  });

  it("returns 0 for integer", () => {
    expect(getNumberDecimals("1")).toBe(0);
    expect(getNumberDecimals(42)).toBe(0);
  });

  it("accepts number input", () => {
    expect(getNumberDecimals(1.1)).toBe(1);
  });
});
