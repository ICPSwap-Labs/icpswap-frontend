import { describe, it, expect } from "vitest";
import {
  transactionsTypeFormat,
  cycleValueFormat,
  isPrincipalUser,
  isAddressUser,
  valueofUser,
  stringToArrayBuffer,
  arrayBufferToString,
  arrayBufferToHex,
  arrayBufferFromHex,
  splitArr,
  toDoubleNumber,
} from "./global";

describe("global", () => {
  describe("transactionsTypeFormat", () => {
    it("returns string as-is", () => {
      expect(transactionsTypeFormat("Swap")).toBe("Swap");
    });
    it("returns first key for object", () => {
      expect(transactionsTypeFormat({ Deposit: null })).toBe("Deposit");
    });
  });

  describe("cycleValueFormat", () => {
    it("returns 0 T for zero or null", () => {
      expect(cycleValueFormat(0)).toContain("0");
      expect(cycleValueFormat(null)).toContain("0");
    });
    it("formats value with T when no noUnit", () => {
      expect(cycleValueFormat(1e12)).toContain("T");
    });
  });

  describe("isPrincipalUser / isAddressUser", () => {
    it("narrows principal user", () => {
      const user = { principal: {} as any };
      expect(isPrincipalUser(user)).toBe(true);
      expect(isAddressUser(user)).toBe(false);
    });
    it("narrows address user", () => {
      const user = { address: "0x123" };
      expect(isAddressUser(user)).toBe(true);
      expect(isPrincipalUser(user)).toBe(false);
    });
  });

  describe("valueofUser", () => {
    it("returns principal or address", () => {
      const p = {} as any;
      expect(valueofUser({ principal: p })).toBe(p);
      expect(valueofUser({ address: "0x" })).toBe("0x");
    });
  });

  describe("stringToArrayBuffer / arrayBufferToString", () => {
    it("round-trips", () => {
      const s = "hello";
      expect(arrayBufferToString(stringToArrayBuffer(s))).toBe(s);
    });
  });

  describe("arrayBufferToHex / arrayBufferFromHex", () => {
    it("round-trips", () => {
      const arr = new Uint8Array([0xab, 0xcd]);
      expect(arrayBufferFromHex(arrayBufferToHex(arr))).toEqual(arr);
    });
  });

  describe("splitArr", () => {
    it("splits array into chunks", () => {
      expect(splitArr([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("returns single chunk when length >= arr.length", () => {
      expect(splitArr([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe("toDoubleNumber", () => {
    it("pads number < 10 with zero", () => {
      expect(toDoubleNumber(5)).toBe("05");
      expect(toDoubleNumber(9)).toBe("09");
    });
    it("returns as string for >= 10", () => {
      expect(toDoubleNumber(10)).toBe("10");
    });
  });
});
