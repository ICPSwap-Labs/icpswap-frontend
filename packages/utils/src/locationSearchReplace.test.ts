import { describe, it, expect } from "vitest";
import { locationSearchReplace, locationMultipleSearchReplace } from "./locationSearchReplace";

describe("locationSearchReplace", () => {
  it("replaces single search param", () => {
    expect(locationSearchReplace("?a=1&b=2", "a", "3")).toBe("?a=3&b=2");
  });

  it("removes param when value is null", () => {
    const result = locationSearchReplace("?a=1&b=2", "a", null);
    expect(result).not.toContain("a=");
  });
});

describe("locationMultipleSearchReplace", () => {
  it("replaces multiple params", () => {
    const result = locationMultipleSearchReplace("?a=1&b=2", [
      { key: "a", value: "x" },
      { key: "b", value: "y" },
    ]);
    expect(result).toContain("a=x");
    expect(result).toContain("b=y");
  });

  it("deletes param when value is falsy", () => {
    const result = locationMultipleSearchReplace("?a=1&b=2", [{ key: "a", value: null }]);
    expect(result).not.toContain("a=");
  });
});
