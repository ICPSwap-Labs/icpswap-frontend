import { describe, it, expect } from "vitest";
import { classNames } from "./classes";

describe("classNames", () => {
  it("joins truthy strings", () => {
    expect(classNames(["a", "b", "c"])).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(classNames(["a", false, "b", undefined, "c"])).toBe("a b c");
  });

  it("returns empty string for all falsy", () => {
    expect(classNames([false, undefined, ""])).toBe("");
  });
});
