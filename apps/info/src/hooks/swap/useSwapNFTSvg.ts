import { useCallback } from "react";
import { swapNFT } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";

export function useSwapNFTSvg() {
  return useCallback(async (tokenId: bigint | number) => {
    const data = resultFormat<string>(await (await swapNFT()).tokenURI(BigInt(tokenId))).data;
    return JSON.parse(data ?? "") as { image: string; [key: string]: any };
  }, []);
}
