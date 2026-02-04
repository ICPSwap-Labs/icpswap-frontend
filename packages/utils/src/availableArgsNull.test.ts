import { describe, it, expect } from "vitest";
import { availableArgsNull } from "./availableArgsNull";

describe("availableArgsNull", () => {
  it("returns [value] when value is truthy", () => {
    expect(availableArgsNull(1)).toEqual([1]);
    expect(availableArgsNull("a")).toEqual(["a"]);
    expect(availableArgsNull({ x: 1 })).toEqual([{ x: 1 }]);
  });

  it("returns [] when value is null or undefined", () => {
    expect(availableArgsNull(null)).toEqual([]);
    expect(availableArgsNull(undefined)).toEqual([]);
  });

  it("returns [] when value is 0 or false", () => {
    expect(availableArgsNull(0)).toEqual([]);
    expect(availableArgsNull(false)).toEqual([]);
  });
});
