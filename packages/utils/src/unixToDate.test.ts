import { describe, it, expect } from "vitest";
import { unixToDate } from "./unixToDate";

describe("unixToDate", () => {
  it("formats unix timestamp to date string", () => {
    // 0 = 1970-01-01 UTC
    expect(unixToDate(0)).toBe("1970-01-01");
  });

  it("accepts custom format", () => {
    expect(unixToDate(0, "YYYY")).toBe("1970");
  });
});
