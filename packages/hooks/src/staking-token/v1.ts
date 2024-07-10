import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, isPrincipal, availableArgsNull } from "@icpswap/utils";
import { v1StakingTokenStorage, v1StakingToken, v1StakingTokenController } from "@icpswap/actor";
import type {
  V1StakingPoolInfo,
  V1StakingPoolTransaction,
  V1StakingPoolUserInfo,
  V1StakingPoolControllerPoolInfo,
  ActorIdentity,
  PaginationResult,
} from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

export async function getV1StakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<V1StakingPoolControllerPoolInfo>>(
    await (
      await v1StakingTokenController()
    ).findTokenPoolPage(availableArgsNull<bigint>(state), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useV1StakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getV1StakingTokenPools(state, offset, limit);
    }, [offset, limit, state]),
  );
}

/* token pool */
export async function getV1StakingTokenPool(canisterId: string) {
  return resultFormat<V1StakingPoolInfo>(await (await v1StakingToken(canisterId)).getPoolInfo()).data;
}

export function useV1StakingTokenPool(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getV1StakingTokenPool(canisterId!);
    }, [canisterId]),
    reload,
  );
}

export async function getV1StakingTokenUserInfo(canisterId: string, account: string | Principal) {
  return resultFormat<V1StakingPoolUserInfo>(
    await (
      await v1StakingToken(canisterId)
    ).getUserInfo(isPrincipal(account) ? { principal: account } : { address: account }),
  ).data;
}

export function useV1StakingTokenUserInfo(
  canisterId: string | undefined,
  account: string | Principal | undefined,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !account) return undefined;
      return await getV1StakingTokenUserInfo(canisterId!, account!);
    }, [canisterId, account]),
    reload,
  );
}

export async function getV1StakingTokenCycles(canisterId: string) {
  return resultFormat<{ available: bigint; balance: bigint }>(await (await v1StakingToken(canisterId)).getCycleInfo())
    .data.available;
}

export function useV1StakingTokenCycles(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getV1StakingTokenCycles(canisterId!);
    }, [canisterId]),
    reload,
  );
}

export async function v1StakingTokenDeposit(canisterId: string, identity: ActorIdentity) {
  return resultFormat<string>(await (await v1StakingToken(canisterId, identity)).deposit());
}

export async function v1StakingTokenDepositFrom(canisterId: string, identity: ActorIdentity, amount: bigint) {
  return resultFormat<string>(await (await v1StakingToken(canisterId, identity)).depositFrom(amount));
}

export async function v1StakingTokenHarvest(canisterId: string, identity: ActorIdentity) {
  return resultFormat<bigint>(await (await v1StakingToken(canisterId, identity)).harvest());
}

export async function v1StakingTokenWithdraw(canisterId: string, identity: ActorIdentity, amount: bigint) {
  return resultFormat<string>(await (await v1StakingToken(canisterId, identity)).withdraw(amount));
}

export async function v1StakingTokenClaim(canisterId: string, identity: ActorIdentity) {
  return resultFormat<string>(await (await v1StakingToken(canisterId, identity)).claim());
}

/*  storage */
export async function getV1StakingTokenTransactions(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<V1StakingPoolTransaction>>(
    await (await v1StakingTokenStorage(canisterId)).getTrans(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useV1StakingTokenTransactions(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getV1StakingTokenTransactions(canisterId, offset, limit);
    }, [canisterId, offset, limit]),
    reload,
  );
}

export async function getV1StakingTokenClaimTransactions(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<V1StakingPoolTransaction>>(
    await (await v1StakingTokenStorage(canisterId)).getRewardTrans(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useV1StakingTokenClaimTransactions(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getV1StakingTokenClaimTransactions(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
    reload,
  );
}
