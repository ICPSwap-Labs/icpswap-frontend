import { TickMath, Token, CurrencyAmount } from "@icpswap/swap-sdk";
import JSBI from "jsbi";
import { getAmount0, getAmount1 } from "components/info/DensityChart/utils/getAmounts";

export function calculateTokensLocked({
  token0,
  token1,
  currentTick,
  nextTick,
  amount,
  tick,
  sqrtPriceX96,
}: {
  token0: Token;
  token1: Token;
  currentTick: number;
  nextTick?: number;
  amount: JSBI;
  tick: { tick: number; liquidityNet: JSBI };
  sqrtPriceX96?: JSBI;
}): { amount0Locked: number; amount1Locked: number } {
  try {
    const tickLower = tick.tick;
    const tickUpper = Math.min(TickMath.MAX_TICK, nextTick ?? TickMath.MAX_TICK);
    const currSqrtPriceX96 = sqrtPriceX96 ?? TickMath.getSqrtRatioAtTick(currentTick);

    const amount0BigInt = getAmount0({
      tickLower,
      tickUpper,
      currentTick,
      liquidity: amount,
      currSqrtPriceX96,
    });
    const amount1BigInt = getAmount1({
      tickLower,
      tickUpper,
      currentTick,
      liquidity: amount,
      currSqrtPriceX96,
    });

    const amount0Locked = parseFloat(CurrencyAmount.fromRawAmount(token0, amount0BigInt.toString()).toExact());
    const amount1Locked = parseFloat(CurrencyAmount.fromRawAmount(token1, amount1BigInt.toString()).toExact());

    return { amount0Locked, amount1Locked };
  } catch (error) {
    console.error(error);
    return { amount0Locked: 0, amount1Locked: 0 };
  }
}
