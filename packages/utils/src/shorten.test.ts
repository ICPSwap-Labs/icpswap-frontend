import { describe, it, expect } from "vitest";
import { shorten, shortenString } from "./shorten";

describe("shorten", () => {
  it("shortens string with default length 4", () => {
    expect(shorten("1234567890")).toBe("1234...7890");
  });

  it("uses custom length", () => {
    expect(shorten("1234567890", 2)).toBe("12...90");
  });

  it("returns shortened string when length*2 >= str.length", () => {
    expect(shorten("12345", 4)).toBe("1234...");
  });

  it("handles empty string", () => {
    expect(shorten("")).toBe("...");
  });
});

describe("shortenString", () => {
  it("shortens with limit", () => {
    expect(shortenString("hello world", 5)).toBe("hello...");
  });

  it("returns full string when under limit", () => {
    expect(shortenString("hi", 5)).toBe("hi");
  });

  it("uses shorten when no limit", () => {
    expect(shortenString("12345678")).toBe("1234...");
  });
});
