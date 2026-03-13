import { OLD_CANISTER_IDS } from "constants/nft";
import { resultFormat } from "@icpswap/utils";
import {
  getNFTCanisterMetadata,
  getV1NFTCanisterMetadata,
  getNFTStat,
  getV1NFTStat,
} from "@icpswap/hooks";
import { swapNFT, NFTCanister } from "@icpswap/actor";
import { SwapNFTCanisterId } from "constants/canister";
import type { NFTCanisterInfo } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useNFTCanisterCycles(canisterId: string): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisterCycles", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).availableCycles()).data;
    },
    enabled: !!canisterId,
  });
}

export function useNFTCanisterCount(canisterId: string): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisterCount", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).supply("1")).data;
    },
    enabled: !!canisterId,
  });
}

export function useNFTUserCanisterCount(
  canisterId: string,
  account: string,
): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTUserCanisterCount", canisterId, account],
    queryFn: async () => {
      if (!canisterId || !account) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).ownerNFTCount({ address: account })).data;
    },
    enabled: !!canisterId && !!account,
  });
}

export function useNFTCanisterMetadata(
  canisterId: string,
): UseQueryResult<NFTCanisterInfo | Awaited<ReturnType<typeof getNFTCanisterMetadata>> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisterMetadata", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;

      if (OLD_CANISTER_IDS.includes(canisterId)) return await getV1NFTCanisterMetadata(canisterId);

      if (canisterId === SwapNFTCanisterId)
        return resultFormat<NFTCanisterInfo>(await (await swapNFT()).getCanisterInfo()).data;

      return await getNFTCanisterMetadata(canisterId);
    },
    enabled: !!canisterId,
  });
}

export function useNFTOtherStat(
  canisterId: string | undefined,
): UseQueryResult<Awaited<ReturnType<typeof getNFTStat>> | Awaited<ReturnType<typeof getV1NFTStat>> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTOtherStat", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;

      try {
        if (OLD_CANISTER_IDS.includes(canisterId)) return await getV1NFTStat(canisterId);
        return await getNFTStat(canisterId);
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!canisterId,
  });
}
