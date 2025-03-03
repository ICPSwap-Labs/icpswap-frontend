import { ckUSDC, ckUSDT } from "@icpswap/tokens";
import { type PublicPoolOverView } from "@icpswap/types";
import { FeeAmount } from "@icpswap/swap-sdk";

export function isStablePairSpec({ token0Id, token1Id }: { token0Id: string; token1Id: string }) {
  return (
    (token0Id === ckUSDC.address && token1Id === ckUSDT.address) ||
    (token0Id === ckUSDT.address && token1Id === ckUSDC.address)
  );
}

export function swapPoolsFilter({ token0Id, token1Id, fee }: { token0Id: string; token1Id: string; fee: FeeAmount }) {
  // ckUSDC/ckUSDT/500
  if (isStablePairSpec({ token0Id, token1Id })) {
    return fee !== FeeAmount.LOW;
  }

  return fee !== FeeAmount.MEDIUM;
}

export function swapPoolsInfoFilter({ pool }: { pool: PublicPoolOverView }) {
  // ckUSDC/ckUSDT/500
  if (isStablePairSpec({ token0Id: pool.token0Id, token1Id: pool.token1Id })) {
    return pool.token0Price === 0 || pool.token1Price === 0;
  }

  return pool.token0Price === 0 || pool.token1Price === 0 || pool.feeTier !== BigInt(FeeAmount.MEDIUM);
}
