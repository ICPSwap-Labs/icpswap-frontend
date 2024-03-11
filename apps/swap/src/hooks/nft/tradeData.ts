import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import type { NFTControllerInfo, TradeStateResult } from "@icpswap/types";
import { PaginationResult } from "types/global";
import { NFTTradeStat, NFTCanisterController } from "@icpswap/actor";
import { useCallsData } from "@icpswap/hooks";

export function useMarketplaceRecommendCanisters(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findTop5Canister(BigInt(offset), BigInt(limit)),
      ).data;
    }, [offset, limit]),
  );
}

export function useNFTCanisters(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
      ).data;
    }, [offset, limit]),
  );
}

export function useCollectionData(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      const result = await (await NFTTradeStat()).getCanisterStat(canisterId!);
      return resultFormat<TradeStateResult>(result).data;
    }, [canisterId]),
  );
}
