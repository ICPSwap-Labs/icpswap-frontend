import { describe, it, expect } from "vitest";

import { Token } from "./token";

describe("Token", () => {
  const ADDRESS_ONE = "2ouva-viaaa-aaaaq-aaamq-cai";
  const ADDRESS_TWO = "mxzaz-hqaaa-aaaar-qaada-cai";
  const DAI_MAINNET = "zfcdd-tqaaa-aaaaq-aaaga-cai";

  describe("#constructor", () => {
    it("fails with invalid address", () => {
      expect(
        () =>
          new Token({
            symbol: "A",
            name: "A",
            address: "0x_hello_00000000000000000000000000000000002",
            decimals: 18,
            standard: "EXT",
          }).address,
      ).toThrow("0x_hello_00000000000000000000000000000000002 is not a valid address");
    });
    it("fails with negative decimals", () => {
      expect(
        () => new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: -1, standard: "EXT" }).address,
      ).toThrow("DECIMALS");
    });
    it("fails with 256 decimals", () => {
      expect(
        () => new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 256, standard: "EXT" }).address,
      ).toThrow("DECIMALS");
    });
    it("fails with non-integer decimals", () => {
      expect(
        () => new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 1.5, standard: "EXT" }).address,
      ).toThrow("DECIMALS");
    });
  });

  describe("#equals", () => {
    it("fails if address differs", () => {
      expect(
        new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 18, standard: "EXT" }).equals(
          new Token({ symbol: "A", name: "A", address: ADDRESS_TWO, decimals: 18, standard: "EXT" }),
        ),
      ).toBe(false);
    });

    it("true if only decimals differs", () => {
      expect(
        new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 9, standard: "EXT" }).equals(
          new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 18, standard: "EXT" }),
        ),
      ).toBe(true);
    });

    it("true if address is the same", () => {
      expect(
        new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 18, standard: "EXT" }).equals(
          new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 18, standard: "EXT" }),
        ),
      ).toBe(true);
    });

    it("true on reference equality", () => {
      const token = new Token({ symbol: "A", name: "A", address: ADDRESS_ONE, decimals: 18, standard: "EXT" });
      expect(token.equals(token)).toBe(true);
    });

    it("true even if name/symbol/decimals differ", () => {
      const tokenA = new Token({ address: ADDRESS_ONE, decimals: 9, symbol: "abc", name: "def", standard: "EXT" });
      const tokenB = new Token({ address: ADDRESS_ONE, decimals: 18, symbol: "ghi", name: "jkl", standard: "EXT" });
      expect(tokenA.equals(tokenB)).toBe(true);
    });

    it("true even if one token is checksummed and the other is not", () => {
      const tokenA = new Token({ address: DAI_MAINNET, decimals: 18, symbol: "DAI", name: "DAI", standard: "EXT" });
      const tokenB = new Token({
        address: DAI_MAINNET.toLowerCase(),
        decimals: 18,
        symbol: "DAI",
        name: "DAI",
        standard: "EXT",
      });
      expect(tokenA.equals(tokenB)).toBe(true);
    });
  });
});
