import { useCallback } from "react";
import { isPrincipal, isAvailablePageArgs } from "@icpswap/utils";
import { tokenAdapter } from "@icpswap/token-adapter";
import { Principal } from "@dfinity/principal";
import type { ActorIdentity, StatusResult } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getTokenTotalHolder(canisterId: string | undefined) {
  return (
    await tokenAdapter.totalHolders({
      canisterId: canisterId!,
    })
  ).data;
}

export function useTokenTotalHolder(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenTotalHolder(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getTokenHolders(canisterId: string, offset: number, limit: number) {
  return (
    await tokenAdapter.holders({
      canisterId,
      params: {
        offset: BigInt(offset),
        limit: BigInt(limit),
      },
    })
  ).data;
}

export function useTokenHolders(canisterId: string, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTokenHolders(canisterId, offset, limit);
    }, [offset, limit, canisterId]),
  );
}

export interface getTokenTransactionProps {
  canisterId: string;
  account: string | undefined | null | Principal;
  offset: number;
  limit: number;
  capId?: string;
  witness?: boolean;
}

export async function getTokenTransaction({
  canisterId,
  account,
  offset,
  limit,
  capId,
  witness,
}: getTokenTransactionProps) {
  return (
    await tokenAdapter.transactions({
      canisterId,
      params: {
        user: account ? (isPrincipal(account) ? { principal: account } : { address: account }) : undefined,
        offset,
        limit,
        index: undefined,
        hash: undefined,
        capId,
        witness,
      },
    })
  ).data;
}

export interface useTokenTransactionsProps {
  canisterId: string;
  account: string | undefined | null | Principal;
  offset: number;
  limit: number;
  cap?: boolean;
  capId?: string;
  witness?: boolean;
}

export function useTokenTransactions({
  canisterId,
  account,
  offset,
  limit,
  capId,
  witness,
}: useTokenTransactionsProps) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;

      return getTokenTransaction({
        canisterId,
        account,
        offset,
        limit,
        capId,
        witness,
      });
    }, [offset, limit, canisterId, account, capId, witness]),
  );
}

export async function getTokenSupply(canisterId: string) {
  return (await tokenAdapter.supply({ canisterId: canisterId! })).data;
}

export function useTokenSupply(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenSupply(canisterId!);
    }, [canisterId]),
    reload,
  );
}

export async function getTokenMetadata(canisterId: string) {
  return (await tokenAdapter.metadata({ canisterId })).data;
}

export function useTokenMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => await getTokenMetadata(canisterId!), [canisterId]),
    !!canisterId,
  );
}

export interface Allowance {
  canisterId: string;
  account: Principal | string;
  spenderCanisterId: string;
  subaccount?: number[];
}

export async function allowance({ canisterId, account, spenderCanisterId, subaccount }: Allowance) {
  return (
    await tokenAdapter.allowance({
      canisterId,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        owner: isPrincipal(account) ? { principal: account } : { address: account },
        subaccount,
      },
    })
  ).data;
}

export interface Approve {
  canisterId: string;
  identity: ActorIdentity;
  spenderCanisterId: string;
  value: number | string | bigint;
  account: string | Principal | undefined;
  subaccount?: number[];
}

export async function approve({ canisterId, identity, spenderCanisterId, value, account, subaccount }: Approve) {
  return tokenAdapter.approve({
    canisterId,
    identity,
    params: {
      spender: Principal.fromText(spenderCanisterId),
      allowance: BigInt(value),
      subaccount,
      account: account!,
    },
  });
}

export function useApproveCallback(): (approveParams: Approve) => Promise<StatusResult<boolean>> {
  return useCallback(async ({ canisterId, identity, spenderCanisterId, value, account }: Approve) => {
    if (!account)
      return await Promise.resolve({
        status: "err",
        message: "Invalid account",
      } as StatusResult<boolean>);

    const allowedBalance = await allowance({
      canisterId,
      account,
      spenderCanisterId,
    });

    if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(value ?? 0) > allowedBalance) {
      return await approve({
        canisterId,
        identity,
        spenderCanisterId,
        value,
        account,
      });
    } 
      return await Promise.resolve({
        status: "ok",
        data: true,
        message: "You have approved successfully",
      } as StatusResult<boolean>);
    
  }, []);
}

export async function getTokenMintingAccount(canisterId: string) {
  return (await tokenAdapter.getMintingAccount({ canisterId })).data;
}

export function useTokenMintingAccount(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenMintingAccount(canisterId);
    }, [canisterId]),
  );
}
