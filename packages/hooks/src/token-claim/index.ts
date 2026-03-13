import { tokenClaimController, tokenClaimStorage } from "@icpswap/actor";
import { resultFormat, isAvailablePageArgs, optionalArg, nonUndefinedOrNull } from "@icpswap/utils";
import type { PaginationResult, ClaimEventInfo, ClaimQuota, ClaimTransaction, StatusResult } from "@icpswap/types";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export async function getEvent(eventId: string): Promise<ClaimEventInfo | undefined> {
  return resultFormat<ClaimEventInfo>(await (await tokenClaimController()).getEvent(eventId)).data;
}

export function useEvent(eventId: string | undefined): UseQueryResult<ClaimEventInfo | undefined, Error> {
  return useQuery({
    queryKey: ["claimEvent"],
    queryFn: async () => {
      if (!eventId) return undefined;
      return await getEvent(eventId!);
    },
    enabled: nonUndefinedOrNull(eventId),
  });
}

export async function claimToken(eventId: string, storageId: string): Promise<StatusResult<boolean>> {
  return resultFormat<boolean>(await (await tokenClaimStorage(storageId, true)).userClaim(eventId));
}

export async function createClaimEvent(args: ClaimEventInfo): Promise<StatusResult<string>> {
  return resultFormat<string>(await (await tokenClaimController(true)).create(args));
}

export async function setClaimEventReady(id: string): Promise<StatusResult<boolean>> {
  return resultFormat<boolean>(await (await tokenClaimController(true)).ready(id));
}

export async function setClaimEventState(id: string, state: boolean): Promise<StatusResult<boolean>> {
  return resultFormat<boolean>(await (await tokenClaimController(true)).setStatus(id, state));
}

export async function setClaimEventData(id: string, args: ClaimQuota[]): Promise<StatusResult<boolean>> {
  return resultFormat<boolean>(await (await tokenClaimController(true)).importQuota(id, args));
}

export async function getClaimEvents(
  offset: number,
  limit: number,
): Promise<PaginationResult<ClaimEventInfo> | undefined> {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findAllEvents(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useClaimEvents(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<ClaimEventInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["claimEvents", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getClaimEvents(offset, limit);
    },
  });
}

export async function getUserCreatedClaimEvents(
  user: string,
  offset: number,
  limit: number,
): Promise<PaginationResult<ClaimEventInfo> | undefined> {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findCreateEvents(Principal.fromText(user), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserCreatedClaimEvents(
  user: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<ClaimEventInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["userCreatedClaimEvents", user, offset, limit],
    queryFn: async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserCreatedClaimEvents(user!, offset, limit);
    },
    enabled: nonUndefinedOrNull(user) && isAvailablePageArgs(offset, limit),
  });
}

export async function getUserClaimEvents(
  user: string,
  offset: number,
  limit: number,
): Promise<PaginationResult<ClaimEventInfo> | undefined> {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findUserEvents(Principal.fromText(user), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserClaimEvents(
  user: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<ClaimEventInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["userClaimEvents", user, offset, limit],
    queryFn: async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserClaimEvents(user!, offset, limit);
    },
  });
}

export async function getClaimEventTransactions(
  id: string,
  state: number | undefined,
  offset: number,
  limit: number,
): Promise<PaginationResult<ClaimTransaction> | undefined> {
  return resultFormat<PaginationResult<ClaimTransaction>>(
    await (
      await tokenClaimController()
    ).findEventRecords(
      id,
      state === undefined ? [] : optionalArg<bigint>(BigInt(state)),
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useClaimEventTransactions(
  id: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<ClaimTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["claimEventTransactions", id, state, offset, limit],
    queryFn: async () => {
      if (!id || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getClaimEventTransactions(id!, state, offset, limit);
    },
  });
}

export async function getUserClaimEventTransactions(
  user: string,
  id: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number,
): Promise<PaginationResult<ClaimTransaction> | undefined> {
  return resultFormat<PaginationResult<ClaimTransaction>>(
    await (
      await tokenClaimController()
    ).findUserEventRecords(
      Principal.fromText(user),
      id === undefined ? [] : optionalArg<string>(id),
      state === undefined ? [] : optionalArg<bigint>(BigInt(state)),
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useUserClaimEventTransactions(
  user: string | undefined,
  id: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<ClaimTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["userClaimEventTransactions", user, id, state, offset, limit],
    queryFn: async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserClaimEventTransactions(user!, id, state, offset, limit);
    },
  });
}
