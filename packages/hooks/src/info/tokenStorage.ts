import { resultFormat } from "@icpswap/utils";
import { tokenStorage } from "@icpswap/actor";
import { PublicTokenPricesData } from "@icpswap/types";

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
