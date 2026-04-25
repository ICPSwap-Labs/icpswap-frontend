import { Principal } from "@icpswap/dfinity";
import { swapPool } from "@icpswap/actor";
import type {
  IcpSwapAPIPageResult,
  InfoSwapRecordResponse,
  LimitOrder,
  LimitOrderKey,
  LimitOrderValue,
  Null,
} from "@icpswap/types";
import {
  getTimeRangeForPastDays,
  icpswap_fetch_get,
  isAvailablePageArgs,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  resultFormat,
} from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

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

interface GetUserLimitTransactionsProps {
  principal: string;
  page: number;
  limit: number;
  begin: number;
  end: number;
}

export async function getUserLimitTransactions({ principal, page, limit, begin, end }: GetUserLimitTransactionsProps) {
  return (
    await icpswap_fetch_get<IcpSwapAPIPageResult<InfoSwapRecordResponse>>(
      `/info/record/limitOrder/list?principal=${principal}&page=${page}&limit=${limit}&begin=${begin}&end=${end}`,
    )
  ).data;
}

// Default to 180 days history
export function useUserLimitTransactions(
  principal: string | undefined,
  offset: number,
  limit: number,
  refresh?: number,
): UseQueryResult<IcpSwapAPIPageResult<InfoSwapRecordResponse> | undefined, Error> {
  const enabled = nonUndefinedOrNull(principal) && isAvailablePageArgs(offset, limit);
  return useQuery({
    queryKey: ["useUserLimitTransactions", principal, offset, limit, refresh],
    queryFn: async () => {
      if (isUndefinedOrNull(principal)) return undefined;

      const { start, end } = getTimeRangeForPastDays(180 - 1);

      return await getUserLimitTransactions({ principal, page: offset, limit, begin: start, end });
    },
    enabled,
  });
}
