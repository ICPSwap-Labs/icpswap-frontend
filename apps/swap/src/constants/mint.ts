import { JSBI } from "utils/index";
import { Percent, BigintIsh } from "@icpswap/swap-sdk";

export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export enum FIELD {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

export const DEFAULT_FEE = 3000;

export enum FeeAmount {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

export const TICK_SPACING = {
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
};

export const BIG_INT_ZERO = JSBI.BigInt(0);

export enum BURN_FIELD {
  LIQUIDITY_PERCENT = "LIQUIDITY_PERCENT",
  LIQUIDITY = "LIQUIDITY",
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

export const DEFAULT_SWAP_SLIPPAGE = 500;

export const DEFAULT_MINT_SLIPPAGE = 500;

export const DEFAULT_BURN_SLIPPAGE = 5000;

export const SLIPPAGE_TOLERANCE: { id: string; value: number }[] = [
  { id: "swap", value: 100 },
  { id: "burn", value: 500 },
  { id: "mint", value: 5000 },
];

export const MAX_SLIPPAGE_TOLERANCE = 50000;

export const WARNING_SLIPPAGE_TOLERANCE = 20000;

export const getDefaultSlippageTolerance = (type: string) =>
  SLIPPAGE_TOLERANCE.filter((item) => item.id === type)[0]?.value || 500;

export const slippageToPercent = (slippage: BigintIsh) => new Percent(slippage, 1000 * 100);

export const MAX_TRANSACTIONS_DEADLINE = 180;
export const DEFAULT_TRANSACTIONS_DEADLINE = 30;

export const DEFAULT_MULTIPLE_APPROVE = 5;
