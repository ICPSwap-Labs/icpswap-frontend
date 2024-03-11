import { Token } from "../core";
import { FeeAmount } from "../constants";

/**
 * Computes a pool address
 * @param token0 The first token of the pair, irrespective of sort order
 * @param token1 The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @returns The pool address
 */
export function computePoolAddress({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: Token;
  tokenB: Token;
  fee: FeeAmount;
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks

  return `${token0.address}_${token1.address}_${fee}`;
}

export function computePoolAddressFromTokenAddress(
  token0Address: string,
  token1Address: string,
  fee: number
): string | undefined {
  if (!token0Address || !token1Address || !fee) return undefined;
  return `${token0Address}_${token1Address}_${fee}`;
}
