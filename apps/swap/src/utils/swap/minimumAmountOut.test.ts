import { CurrencyAmount, Percent, Token } from "@icpswap/swap-sdk";
import { describe, expect, it } from "vitest";
import { getSlippageWarningLevel, minimumAmountOutBySlippage } from "./slippage";

const token = new Token({
  address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  decimals: 8,
  symbol: "ICP",
  name: "ICP",
  standard: "ICRC1",
});

const amountOut = (raw: string) => CurrencyAmount.fromRawAmount(token, raw);
const slippage = (numerator: number, denominator: number) => new Percent(numerator, denominator);

const minRaw = (raw: string, slippageTolerance: Percent) =>
  minimumAmountOutBySlippage(amountOut(raw), slippageTolerance).quotient.toString();

describe("minimumAmountOutBySlippage", () => {
  it("uses (1 - slippage), not 1 / (1 + slippage)", () => {
    // (1 - 5%) = 95% -> 950, while 1 / 1.05 would give 952
    expect(minRaw("1000", slippage(5, 100))).toBe("950");
  });

  it("applies a 0.5% slippage", () => {
    expect(minRaw("1000", slippage(5, 1000))).toBe("995");
  });

  it("applies a 0.1% slippage", () => {
    expect(minRaw("1000", slippage(1, 1000))).toBe("999");
  });

  it("keeps the amount when slippage is zero", () => {
    expect(minRaw("1000", slippage(0, 100))).toBe("1000");
  });

  it("returns zero when slippage reaches 100%", () => {
    expect(minRaw("1000", slippage(100, 100))).toBe("0");
    expect(minRaw("1000", slippage(200, 100))).toBe("0");
  });

  it("works with large raw amounts (bigint precision is preserved)", () => {
    // 1 ICP (8 decimals) with 0.5% slippage
    expect(minRaw("100000000", slippage(5, 1000))).toBe("99500000");
  });
});

describe("getSlippageWarningLevel", () => {
  it("warns when slippage is below 0.05%", () => {
    expect(getSlippageWarningLevel("0.04")).toBe("low");
    expect(getSlippageWarningLevel(0)).toBe("low");
  });

  it("does not warn exactly at the boundaries", () => {
    expect(getSlippageWarningLevel("0.05")).toBeNull();
    expect(getSlippageWarningLevel("5")).toBeNull();
  });

  it("warns when slippage is above 5%", () => {
    expect(getSlippageWarningLevel("5.01")).toBe("high");
    expect(getSlippageWarningLevel("50")).toBe("high");
  });

  it("ignores empty or invalid input", () => {
    expect(getSlippageWarningLevel("")).toBeNull();
    expect(getSlippageWarningLevel("abc")).toBeNull();
  });
});
