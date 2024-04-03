import { useCallback } from "react";
import { type ExtNft } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export function useExtUserNFTs(address: string | undefined, reload?: boolean) {
  const call = useCallback(async () => {
    if (!address) return undefined;
    const result = await fetch(`https://us-central1-entrepot-api.cloudfunctions.net/api/user/${address}/all`).catch(
      () => undefined,
    );

    if (!result) return undefined;

    return (await result.json()) as ExtNft[];
  }, [address]);

  return useCallsData(call, reload);
}
