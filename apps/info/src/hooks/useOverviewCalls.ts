import { NFT_V1 } from "@icpswap/actor";
import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";

export function useNFTHolders() {
  return useCallsData(useCallback(async () => (await NFT_V1("kig6x-7yaaa-aaaah-aa2xq-cai")).getNftHolderInfo(), []));
}

export function useNFTOverview() {
  return useCallsData(useCallback(async () => (await NFT_V1("kig6x-7yaaa-aaaah-aa2xq-cai")).getNftStat(), []));
}
