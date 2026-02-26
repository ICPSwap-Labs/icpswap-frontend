import { describe, it, expect } from "vitest";
import { optionalArg } from "./availableArgsNull";

describe("optionalArg", () => {
  it("returns [value] when value is truthy", () => {
    expect(optionalArg(1)).toEqual([1]);
    expect(optionalArg("a")).toEqual(["a"]);
    expect(optionalArg({ x: 1 })).toEqual([{ x: 1 }]);
  });

  it("returns [] when value is null or undefined", () => {
    expect(optionalArg(null)).toEqual([]);
    expect(optionalArg(undefined)).toEqual([]);
  });

  it("returns [] when value is 0 or false", () => {
    expect(optionalArg(0)).toEqual([]);
    expect(optionalArg(false)).toEqual([]);
  });
});
