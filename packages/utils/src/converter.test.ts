import { describe, it, expect } from "vitest";
import { hexToBytes, toHexString, asciiStringToByteArray } from "./converter";

describe("converter", () => {
  describe("hexToBytes", () => {
    it("converts hex string to byte array", () => {
      expect(hexToBytes("ff")).toEqual([255]);
      expect(hexToBytes("0102")).toEqual([1, 2]);
    });
  });

  describe("toHexString", () => {
    it("converts bytes to hex string", () => {
      expect(toHexString([255, 1, 2])).toBe("ff0102");
      expect(toHexString(new Uint8Array([10, 16]))).toBe("0a10");
    });
  });

  describe("asciiStringToByteArray", () => {
    it("converts string to byte array", () => {
      expect(asciiStringToByteArray("AB")).toEqual([65, 66]);
    });
  });
});
