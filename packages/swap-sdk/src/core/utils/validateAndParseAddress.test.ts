import { describe, it, expect } from "vitest";

import { validateAndParseAddress } from "./validateAndParseAddress";

describe("#validateAndParseAddress", () => {
  it("returns same address if already checksummed", () => {
    expect(validateAndParseAddress("zfcdd-tqaaa-aaaaq-aaaga-cai")).toEqual("zfcdd-tqaaa-aaaaq-aaaga-cai");
  });

  it("throws if not valid", () => {
    expect(() => validateAndParseAddress("zfcdd-tqaaa-aaaaq-aaaga")).toThrow(
      "zfcdd-tqaaa-aaaaq-aaaga is not a valid address.",
    );
  });
});
