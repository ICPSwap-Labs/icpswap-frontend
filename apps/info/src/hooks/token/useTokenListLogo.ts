import { tokenList } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";

export async function getTokenListLogo(tokenId: string) {
  return resultFormat<string>(await (await tokenList()).getLogo(tokenId)).data;
}
