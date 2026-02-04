import { describe, it, expect } from "vitest";
import { isValidUrl } from "./isValidUrl";

describe("isValidUrl", () => {
  it("returns true for valid http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("https://sub.example.com/path")).toBe(true);
  });

  it("returns false for invalid URLs", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false);
  });
});
