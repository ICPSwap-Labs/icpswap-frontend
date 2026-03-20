import { NFTCanisterController, NFTTradeStat } from "@icpswap/actor";
import type { NFTControllerInfo, PaginationResult, TradeStateResult } from "@icpswap/types";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useMarketplaceRecommendCanisters(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTControllerInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useMarketplaceRecommendCanisters", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findTop5Canister(BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export function useNFTCanisters(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTControllerInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisters", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export function useCollectionData(canisterId: string | undefined): UseQueryResult<TradeStateResult | undefined, Error> {
  return useQuery({
    queryKey: ["useCollectionData", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      const result = await (await NFTTradeStat()).getCanisterStat(canisterId);
      return resultFormat<TradeStateResult>(result).data;
    },
    enabled: !!canisterId,
  });
}
