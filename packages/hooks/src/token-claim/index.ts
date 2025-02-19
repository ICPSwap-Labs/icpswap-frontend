import { useCallback } from "react";
import { tokenClaimController, tokenClaimStorage } from "@icpswap/actor";
import { resultFormat, isAvailablePageArgs, availableArgsNull } from "@icpswap/utils";
import type { ActorIdentity, PaginationResult , ClaimEventInfo, ClaimQuota, ClaimTransaction } from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

export async function getEvent(eventId: string) {
  return resultFormat<ClaimEventInfo>(await (await tokenClaimController()).getEvent(eventId)).data;
}

export function useEvent(eventId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!eventId) return undefined;
      return await getEvent(eventId!);
    }, [eventId]),
    reload,
  );
}

export async function claimToken(eventId: string, storageId: string) {
  return resultFormat<boolean>(await (await tokenClaimStorage(storageId, true)).userClaim(eventId));
}

export async function createClaimEvent(args: ClaimEventInfo, identity: ActorIdentity) {
  return resultFormat<string>(await (await tokenClaimController(identity)).create(args));
}

export async function setClaimEventReady(id: string, identity: ActorIdentity) {
  return resultFormat<boolean>(await (await tokenClaimController(identity)).ready(id));
}

export async function setClaimEventState(id: string, state: boolean, identity: ActorIdentity) {
  return resultFormat<boolean>(await (await tokenClaimController(identity)).setStatus(id, state));
}

export async function setClaimEventData(id: string, args: ClaimQuota[], identity: ActorIdentity) {
  return resultFormat<boolean>(await (await tokenClaimController(identity)).importQuota(id, args));
}

export async function getClaimEvents(offset: number, limit: number) {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findAllEvents(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useClaimEvents(offset: number, limit: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getClaimEvents(offset, limit);
    }, [offset, limit]),
    reload,
  );
}

export async function getUserCreatedClaimEvents(user: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findCreateEvents(Principal.fromText(user), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserCreatedClaimEvents(user: string | undefined, offset: number, limit: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserCreatedClaimEvents(user!, offset, limit);
    }, [user, offset, limit]),
    reload,
  );
}

export async function getUserClaimEvents(user: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<ClaimEventInfo>>(
    await (await tokenClaimController()).findUserEvents(Principal.fromText(user), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserClaimEvents(user: string | undefined, offset: number, limit: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserClaimEvents(user!, offset, limit);
    }, [user, offset, limit]),

    reload,
  );
}

export async function getClaimEventTransactions(id: string, state: number | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<ClaimTransaction>>(
    await (
      await tokenClaimController()
    ).findEventRecords(
      id,
      state === undefined ? [] : availableArgsNull<bigint>(BigInt(state)),
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
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!id || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getClaimEventTransactions(id!, state, offset, limit);
    }, [id, state, offset, limit]),
    reload,
  );
}

export async function getUserClaimEventTransactions(
  user: string,
  id: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<ClaimTransaction>>(
    await (
      await tokenClaimController()
    ).findUserEventRecords(
      Principal.fromText(user),
      id === undefined ? [] : availableArgsNull<string>(id),
      state === undefined ? [] : availableArgsNull<bigint>(BigInt(state)),
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
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getUserClaimEventTransactions(user!, id, state, offset, limit);
    }, [user, state, offset, limit]),
    reload,
  );
}
