import { swapPool } from "@icpswap/actor";
import type { PoolMetadata } from "@icpswap/candid";
import { resultFormat } from "@icpswap/utils";

export async function getSwapPoolMeta(canisterId: string) {
  const result = await (await swapPool(canisterId)).metadata();
  return resultFormat<PoolMetadata>(result).data;
}
