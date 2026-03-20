import { tokenStorage } from "@icpswap/actor";
import type { PublicTokenPricesData } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";

export async function getInfoTokenPriceChart(
  storageId: string,
  tokenId: string,
  time: number,
  interval: number,
  limit: number,
) {
  return resultFormat<PublicTokenPricesData[]>(
    await (await tokenStorage(storageId)).getTokenPricesData(tokenId, BigInt(time), BigInt(interval), BigInt(limit)),
  ).data;
}
