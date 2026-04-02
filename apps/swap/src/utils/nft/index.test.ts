import { describe, expect, it } from "vitest";
import { decodeTokenId, encodeTokenIdentifier } from "./index";

describe("encodeTokenIdentifier", () => {
  it("encodes token identifier correctly", () => {
    expect(encodeTokenIdentifier("533td-baaaa-aaaar-qbsya-cai", 1)).toBe("sj74a-jakor-uwiaa-aaaaa-emamw-aaqca-aaaaa-q");
  });
});

describe("decodeTokenId", () => {
  it("decodes token identifier correctly", () => {
    expect(decodeTokenId("sj74a-jakor-uwiaa-aaaaa-emamw-aaqca-aaaaa-q")).toEqual({
      index: 1,
      canister: "533td-baaaa-aaaar-qbsya-cai",
      token: "sj74a-jakor-uwiaa-aaaaa-emamw-aaqca-aaaaa-q",
    });
  });
});
