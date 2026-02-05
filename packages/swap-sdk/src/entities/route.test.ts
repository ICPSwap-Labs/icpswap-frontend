import { describe, it, expect } from "vitest";

import { Token } from "../core";
import { FeeAmount } from "../constants";
import { encodeSqrtRatioX96 } from "../utils/encodeSqrtRatioX96";
import { TickMath } from "../utils/tickMath";
import { Pool } from "./pool";
import { Route } from "./route";

describe("Route", () => {
  const token0 = new Token({
    address: "2ouva-viaaa-aaaaq-aaamq-cai",
    decimals: 18,
    name: "t0",
    symbol: "t00",
    standard: "EXT",
  });

  const token1 = new Token({
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimals: 18,
    name: "t1",
    symbol: "t1",
    standard: "EXT",
  });

  const token2 = new Token({
    address: "zfcdd-tqaaa-aaaaq-aaaga-cai",
    decimals: 18,
    name: "t2",
    symbol: "t2",
    standard: "EXT",
  });

  const pool_0_1 = new Pool("xxxxxxxx", token0, token1, FeeAmount.MEDIUM, encodeSqrtRatioX96(1, 1), 0, 0, []);

  describe("path", () => {
    it("constructs a path from the tokens", () => {
      const route = new Route([pool_0_1], token0, token1);
      expect(route.pools).toEqual([pool_0_1]);
      expect(route.tokenPath).toEqual([token0, token1]);
      expect(route.input).toEqual(token0);
      expect(route.output).toEqual(token1);
    });
  });

  describe("#midPrice", () => {
    const pool_0_1 = new Pool(
      "xxxxxxxx",
      token0,
      token1,
      FeeAmount.MEDIUM,
      encodeSqrtRatioX96(1, 5),
      0,
      TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(1, 5)),
      [],
    );
    const pool_1_2 = new Pool(
      "xxxxxxxx",
      token1,
      token2,
      FeeAmount.MEDIUM,
      encodeSqrtRatioX96(15, 30),
      0,
      TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(15, 30)),
      [],
    );

    it("correct for 0 -> 1", () => {
      const price = new Route([pool_0_1], token0, token1).midPrice;
      expect(price.toFixed(4)).toEqual("0.1999");
      expect(price.baseCurrency.equals(token0)).toEqual(true);
      expect(price.quoteCurrency.equals(token1)).toEqual(true);
    });

    it("is cached", () => {
      const route = new Route([pool_0_1], token0, token1);
      expect(route.midPrice).toStrictEqual(route.midPrice);
    });

    it("correct for 1 -> 0", () => {
      const price = new Route([pool_0_1], token1, token0).midPrice;
      expect(price.toFixed(4)).toEqual("5.0000");
      expect(price.baseCurrency.equals(token1)).toEqual(true);
      expect(price.quoteCurrency.equals(token0)).toEqual(true);
    });

    it("correct for 0 -> 1 -> 2", () => {
      const price = new Route([pool_0_1, pool_1_2], token0, token2).midPrice;
      expect(price.toFixed(4)).toEqual("0.0999");
      expect(price.baseCurrency.equals(token0)).toEqual(true);
      expect(price.quoteCurrency.equals(token2)).toEqual(true);
    });

    it("correct for 2 -> 1 -> 0", () => {
      const price = new Route([pool_1_2, pool_0_1], token2, token0).midPrice;
      expect(price.toFixed(4)).toEqual("10.0000");
      expect(price.baseCurrency.equals(token2)).toEqual(true);
      expect(price.quoteCurrency.equals(token0)).toEqual(true);
    });
  });
});
