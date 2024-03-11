import { Token } from "./token";

describe("Currency", () => {
  const ADDRESS_ZERO = "2ouva-viaaa-aaaaq-aaamq-cai";
  const ADDRESS_ONE = "5xnja-6aaaa-aaaan-qad4a-cai";

  const t0 = new Token({ address: ADDRESS_ZERO, decimals: 18, standard: "EXT" });
  const t1 = new Token({ address: ADDRESS_ONE, decimals: 18, standard: "EXT" });

  describe("#equals", () => {
    it("token1 is not token0", () => {
      expect(t1.equals(t0)).toStrictEqual(false);
    });
    it("token0 is token0", () => {
      expect(t0.equals(t0)).toStrictEqual(true);
    });
    it("token0 is equal to another token0", () => {
      expect(
        t0.equals(new Token({ address: ADDRESS_ZERO, decimals: 18, symbol: "symbol", name: "name", standard: "EXT" }))
      ).toStrictEqual(true);
    });
  });
});
