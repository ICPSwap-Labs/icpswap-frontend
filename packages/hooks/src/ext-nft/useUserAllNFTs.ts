import { useCallback } from "react";
import { type ExtNft } from "@icpswap/types";
import { principalToAccount } from "@icpswap/utils";
import { useCallsData } from "../useCallData";

export function useExtUserNFTs(principal: string | undefined, reload?: boolean) {
  const call = useCallback(async () => {
    if (!principal) return undefined;

    const result = await fetch(
      `https://us-central1-entrepot-api.cloudfunctions.net/api/nftgeek/user/${principal}/${principalToAccount(
        principal,
      )}/nfts`,
    );

    if (!result) return undefined;

    const nfts = (await result.json()).nfts as any;

    return nfts.map((element) => ({
      id: element.tokenid,
      owner: principal,
      canister: element.canister,
      price: 0,
      time: 0,
      metadata: "",
    })) as ExtNft[];
  }, [principal]);

  return useCallsData(call, reload);
}
