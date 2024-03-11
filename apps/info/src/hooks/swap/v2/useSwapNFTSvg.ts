import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { v2SwapPositionManager } from "hooks/useActor";

export function useV2SwapNFTSvg() {
  return useCallback(async (tokenId: bigint | number) => {
    const data = resultFormat<string>(await (await v2SwapPositionManager()).tokenURI(BigInt(tokenId))).data;
    return JSON.parse(data ?? "") as { image: string; [key: string]: any };
  }, []);
}
