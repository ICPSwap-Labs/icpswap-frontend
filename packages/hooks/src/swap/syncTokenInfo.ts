import { icpswap_fetch_post } from "@icpswap/utils";

export async function syncServerTokenInfo(tokenId: string) {
  return await icpswap_fetch_post<null>("/info/tokens/sync", { ledgerId: tokenId });
}
