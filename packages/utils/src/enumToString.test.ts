import { describe, it, expect } from "vitest";
import { enumToString } from "./enumToString";

describe("enumToString", () => {
  it("returns string as-is when type is string", () => {
    expect(enumToString("hello")).toBe("hello");
  });

  it("returns first key when type is object", () => {
    expect(enumToString({ Ok: null })).toBe("Ok");
    expect(enumToString({ Err: "error" })).toBe("Err");
  });

  it("returns type when not string or object", () => {
    expect(enumToString(123 as any)).toBe(123);
  });
});
