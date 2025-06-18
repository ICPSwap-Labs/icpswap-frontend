import { useCallback } from "react";
import { swapPool, limitTransaction } from "@icpswap/actor";
import type { LimitOrderKey, LimitOrderValue, Null, LimitTransactionResult, LimitOrder } from "@icpswap/types";
import { resultFormat, isAvailablePageArgs, nonUndefinedOrNull, isUndefinedOrNull } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export async function placeOrder(canisterId: string, positionId: bigint, tickLimit: bigint) {
  return resultFormat<boolean>(
    await (
      await swapPool(canisterId, true)
    ).addLimitOrder({
      positionId,
      tickLimit,
    }),
  );
}

export async function removeOrder(canisterId: string, positionId: bigint) {
  return resultFormat<boolean>(await (await swapPool(canisterId, true)).removeLimitOrder(positionId));
}

export async function getUserLimitOrders(canisterId: string, principal: string) {
  const result = await (await swapPool(canisterId)).getSortedUserLimitOrders(Principal.fromText(principal));
  return resultFormat<Array<LimitOrder>>(result).data;
}

export function useUserLimitOrders(canisterId: string | Null, principal: string | Null, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal) return undefined;
      return await getUserLimitOrders(canisterId, principal);
    }, [canisterId, principal]),
    refresh,
  );
}

export async function getLimitOrders(canisterId: string) {
  return resultFormat<{
    lowerLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
    upperLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
  }>(await (await swapPool(canisterId)).getLimitOrders()).data;
}

export function useLimitOrders(canisterId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(canisterId)) return undefined;
      return await getLimitOrders(canisterId);
    }, [canisterId]),
  );
}

export async function getPoolLimitAvailableState(canisterId: string) {
  const result = await (await swapPool(canisterId)).getLimitOrderAvailabilityState();
  return resultFormat<boolean>(result).data;
}

export function usePoolLimitAvailableState(canisterId: string | Null, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getPoolLimitAvailableState(canisterId);
    }, [canisterId]),
    refresh,
  );
}

export async function getUserLimitTransactions(principal: string, start: number, offset: number, limit: number) {
  const result = await (await limitTransaction()).get(principal, BigInt(start), BigInt(offset), BigInt(limit));

  return resultFormat<LimitTransactionResult>(result).data;
}

export function useUserLimitTransactions(
  principal: string | undefined,
  start: number | Null,
  offset: number,
  limit: number,
  refresh?: number,
) {
  return useCallsData<LimitTransactionResult>(
    useCallback(async () => {
      if (nonUndefinedOrNull(start) && nonUndefinedOrNull(principal) && isAvailablePageArgs(offset, limit)) {
        return await getUserLimitTransactions(principal, start, offset, limit);
      }

      return undefined;
    }, [start, principal, offset, limit]),
    refresh,
  );
}
