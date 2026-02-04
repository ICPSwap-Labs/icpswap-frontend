import { describe, it, expect } from "vitest";
import { pageArgsFormat } from "./pageArgsFormat";

describe("pageArgsFormat", () => {
  it("returns [offset, end] for page and size", () => {
    expect(pageArgsFormat(1, 10)).toEqual([0, 10]);
    expect(pageArgsFormat(2, 10)).toEqual([10, 20]);
    expect(pageArgsFormat(3, 5)).toEqual([10, 15]);
  });

  it("throws for invalid pageNum", () => {
    expect(() => pageArgsFormat(0, 10)).toThrow("Invalid pageNum");
  });

  it("throws for invalid pageSize", () => {
    expect(() => pageArgsFormat(1, 0)).toThrow("Invalid pageSize");
  });
});
