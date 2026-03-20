import { Principal } from "@icp-sdk/core/principal";
import { limitTransaction, swapPool } from "@icpswap/actor";
import type { LimitOrder, LimitOrderKey, LimitOrderValue, LimitTransactionResult, Null } from "@icpswap/types";
import { isAvailablePageArgs, isUndefinedOrNull, nonUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function placeOrder(canisterId: string, positionId: bigint, tickLimit: bigint) {
  return resultFormat<boolean>(
    await (await swapPool(canisterId, true)).addLimitOrder({
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

export function useUserLimitOrders(
  canisterId: string | Null,
  principal: string | Null,
  refresh?: number,
): UseQueryResult<LimitOrder[] | undefined, Error> {
  return useQuery({
    queryKey: ["useUserLimitOrders", canisterId, principal, refresh],
    queryFn: async () => {
      if (!canisterId || !principal) return undefined;
      return await getUserLimitOrders(canisterId, principal);
    },
    enabled: !!canisterId && !!principal,
  });
}

export async function getLimitOrders(canisterId: string) {
  return resultFormat<{
    lowerLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
    upperLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
  }>(await (await swapPool(canisterId)).getLimitOrders()).data;
}

export function useLimitOrders(canisterId: string | Null): UseQueryResult<
  | {
      lowerLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
      upperLimitOrders: Array<[LimitOrderKey, LimitOrderValue]>;
    }
  | undefined,
  Error
> {
  return useQuery({
    queryKey: ["useLimitOrders", canisterId],
    queryFn: async () => {
      if (isUndefinedOrNull(canisterId)) return undefined;
      return await getLimitOrders(canisterId);
    },
    enabled: !isUndefinedOrNull(canisterId),
  });
}

export async function getPoolLimitAvailableState(canisterId: string) {
  const result = await (await swapPool(canisterId)).getLimitOrderAvailabilityState();
  return resultFormat<boolean>(result).data;
}

export function usePoolLimitAvailableState(
  canisterId: string | Null,
  refresh?: number,
): UseQueryResult<boolean | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolLimitAvailableState", canisterId, refresh],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getPoolLimitAvailableState(canisterId);
    },
    enabled: !!canisterId,
  });
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
): UseQueryResult<LimitTransactionResult | undefined, Error> {
  const enabled = nonUndefinedOrNull(start) && nonUndefinedOrNull(principal) && isAvailablePageArgs(offset, limit);
  return useQuery({
    queryKey: ["useUserLimitTransactions", start, principal, offset, limit, refresh],
    queryFn: async () => {
      if (nonUndefinedOrNull(start) && nonUndefinedOrNull(principal) && isAvailablePageArgs(offset, limit)) {
        return await getUserLimitTransactions(principal, start, offset, limit);
      }

      return undefined;
    },
    enabled,
  });
}
