import { useCallback } from "react";
import { useCallsData } from "../useCallData";
import { type ExtNft } from "@icpswap/types";

export function useExtUserNFTs(address: string | undefined, reload?: boolean) {
  const call = useCallback(async () => {
    if (!address) return undefined;
    const result = await fetch(
      `https://us-central1-entrepot-api.cloudfunctions.net/api/user/${address}/all`
    );
    const data = (await result.json()) as ExtNft[];
    return data;
  }, [address]);

  return useCallsData(call, reload);
}
