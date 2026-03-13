import { useCallback } from "react";
import { isPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { tokenAdapter } from "@icpswap/token-adapter";
import { Principal } from "@icp-sdk/core/principal";
import type { ActorIdentity, StatusResult } from "@icpswap/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface getTokenTransactionProps {
  canisterId: string;
  account: string | undefined | null | Principal;
  offset: number;
  limit: number;
}

export async function getTokenTransaction({ canisterId, account, offset, limit }: getTokenTransactionProps) {
  return (
    await tokenAdapter.transactions({
      canisterId,
      params: {
        user: account ? (isPrincipal(account) ? { principal: account } : { address: account }) : undefined,
        offset,
        limit,
        index: undefined,
        hash: undefined,
      },
    })
  ).data;
}

export async function getTokenSupply(canisterId: string) {
  return (await tokenAdapter.supply({ canisterId: canisterId! })).data;
}

export function useTokenSupply(canisterId: string | undefined): UseQueryResult<bigint, Error> {
  const call = useCallback(async () => {
    if (!canisterId) return undefined;
    return await getTokenSupply(canisterId!);
  }, [canisterId]);

  return useQuery({
    queryKey: ["tokenSupply", canisterId],
    queryFn: call,
    enabled: nonUndefinedOrNull(canisterId),
  });
}

export async function getTokenMetadata(canisterId: string) {
  return (await tokenAdapter.metadata({ canisterId })).data;
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

export function useTokenMintingAccount(canisterId: string | undefined): UseQueryResult<
  {
    owner: string;
    sub: number[];
  },
  Error
> {
  const call = useCallback(async () => {
    if (!canisterId) return undefined;
    return await getTokenMintingAccount(canisterId);
  }, [canisterId]);

  return useQuery({ queryKey: ["tokenMinter", canisterId], queryFn: call, enabled: nonUndefinedOrNull(canisterId) });
}
