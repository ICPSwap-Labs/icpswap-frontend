import { Token } from "../core";
import { FeeAmount } from "../constants";
import { computePoolAddress } from "./computePoolAddress";

describe("#computePoolAddress", () => {
  it("should correctly compute the pool address", () => {
    const tokenA = new Token({
      address: "2ouva-viaaa-aaaaq-aaamq-cai",
      symbol: "USDC",
      name: "USD Coin",
      transFee: 0,
      decimals: 18,
      standard: "EXT",
    });

    const tokenB = new Token({
      address: "mxzaz-hqaaa-aaaar-qaada-cai",
      symbol: "X_TOKEN",
      name: "X-Token",
      transFee: 0,
      decimals: 18,
      standard: "EXT",
    });

    const result = computePoolAddress({
      fee: FeeAmount.MEDIUM,
      tokenA,
      tokenB,
    });

    expect(result).toEqual(
      "2ouva-viaaa-aaaaq-aaamq-cai_mxzaz-hqaaa-aaaar-qaada-cai_3000"
    );
  });

  it("should correctly compute the pool address", () => {
    const USDC = new Token({
      address: "2ouva-viaaa-aaaaq-aaamq-cai",
      symbol: "USDC",
      name: "USD Coin",
      transFee: 0,
      decimals: 18,
      standard: "EXT",
    });

    const X_TOKEN = new Token({
      address: "mxzaz-hqaaa-aaaar-qaada-cai",
      symbol: "X_TOKEN",
      name: "X-Token",
      transFee: 0,
      decimals: 18,
      standard: "EXT",
    });

    let tokenA = USDC;
    let tokenB = X_TOKEN;

    const resultA = computePoolAddress({
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
    });

    tokenA = X_TOKEN;

    tokenB = USDC;
    const resultB = computePoolAddress({
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
    });

    expect(resultA).toEqual(resultB);
  });
});
