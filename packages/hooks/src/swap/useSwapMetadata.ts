import { swapPool } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { PoolMetadata } from "@icpswap/candid";

export async function getSwapPoolMeta(canisterId: string) {
  const result = await (await swapPool(canisterId)).metadata();
  return resultFormat<PoolMetadata>(result).data;
}
