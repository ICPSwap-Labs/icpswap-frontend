import { useCallback } from "react";
import { OLD_CANISTER_IDS } from "constants/nft";
import { resultFormat } from "@icpswap/utils";
import {
  getNFTCanisterMetadata,
  getV1NFTCanisterMetadata,
  getNFTStat,
  getV1NFTStat,
  useCallsData,
} from "@icpswap/hooks";
import { swapNFT, NFTCanister } from "@icpswap/actor";
import { SwapNFTCanisterId } from "constants/canister";
import type { NFTCanisterInfo } from "@icpswap/types";

export function useCanisterCycles(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).availableCycles()).data;
    }, [canisterId]),
  );
}

export function useCanisterNFTCount(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).supply("1")).data;
    }, [canisterId]),
  );
}

export function useCanisterUserNFTCount(canisterId: string, account: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !account) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).ownerNFTCount({ address: account })).data;
    }, [canisterId, account]),
  );
}

export function useNFTCanisterMetadata(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      if (OLD_CANISTER_IDS.includes(canisterId)) return await getV1NFTCanisterMetadata(canisterId);

      if (canisterId === SwapNFTCanisterId)
        return resultFormat<NFTCanisterInfo>(await (await swapNFT()).getCanisterInfo()).data;

      return await getNFTCanisterMetadata(canisterId);
    }, [canisterId]),
  );
}

export function useNFTOtherStat(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      try {
        if (OLD_CANISTER_IDS.includes(canisterId!)) return await getV1NFTStat(canisterId!);
        return await getNFTStat(canisterId!);
      } catch (error) {
        console.error(error);
      }
    }, []),
  );
}
