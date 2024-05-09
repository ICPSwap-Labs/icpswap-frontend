import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, availableArgsNull } from "@icpswap/utils";
import { stakingTokenController, stakingToken } from "@icpswap/actor";
import type {
  CreateTokenPoolArgs,
  StakingTokenPoolInfo,
  StakingPoolControllerPoolInfo,
  StakingPoolTransaction,
  StakingPoolUserInfo,
  StakingPoolCycle,
  StakingPoolGlobalData,
  PaginationResult,
} from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

/* token controller */
export async function createStakingTokenPool(args: CreateTokenPoolArgs) {
  return resultFormat<string>(await (await stakingTokenController(true)).createStakingPool(args));
}

export async function getStakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolControllerPoolInfo>>(
    await (
      await stakingTokenController()
    ).findStakingPoolPage(availableArgsNull<bigint>(state), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenPools(state, offset, limit);
    }, [offset, limit, state]),
  );
}

export async function getStakingTokenGlobalData() {
  return resultFormat<StakingPoolGlobalData>(await (await stakingTokenController()).getGlobalData()).data;
}

export function useStakingTokenGlobalData(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getStakingTokenGlobalData();
    }, []),
    reload,
  );
}

export async function getStakingPoolFromController(canisterId: string) {
  return resultFormat<StakingPoolControllerPoolInfo>(
    await (await stakingTokenController()).getStakingPool(Principal.fromText(canisterId)),
  ).data;
}

export function useStakingPoolInfoFromController(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolFromController(canisterId);
    }, [canisterId]),
  );
}

/* token pool */
export async function getStakingTokenPool(canisterId: string) {
  return resultFormat<StakingTokenPoolInfo>(await (await stakingToken(canisterId)).getPoolInfo()).data;
}

export function useStakingTokenPool(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingTokenPool(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getStakingTokenUserInfo(canisterId: string, principal: Principal) {
  return resultFormat<StakingPoolUserInfo>(await (await stakingToken(canisterId)).getUserInfo(principal)).data;
}

export function useStakingTokenUserInfo(
  canisterId: string | undefined,
  principal: Principal | undefined,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal) return undefined;
      return await getStakingTokenUserInfo(canisterId, principal);
    }, [canisterId, principal]),
    reload,
  );
}

export async function getStakingTokenAllUserInfo(canisterId: string, offset: number, limit: number) {
  return resultFormat<StakingPoolUserInfo>(
    await (await stakingToken(canisterId)).findAllUserInfo(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenAllUserInfo(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenAllUserInfo(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
    reload,
  );
}

export async function getStakingTokenCycles(canisterId: string) {
  return resultFormat<StakingPoolCycle>(await (await stakingToken(canisterId)).getCycleInfo()).data;
}

export function useStakingTokenCycles(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingTokenCycles(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function stakingTokenClaim(canisterId: string) {
  return resultFormat<string>(await (await stakingToken(canisterId, true)).claim());
}

export async function stakingTokenDeposit(canisterId: string) {
  return resultFormat<string>(await (await stakingToken(canisterId, true)).deposit());
}

export async function stakingTokenDepositFrom(canisterId: string, amount: bigint) {
  return resultFormat<string>(await (await stakingToken(canisterId, true)).depositFrom(amount));
}

export async function stakingTokenHarvest(canisterId: string) {
  return resultFormat<bigint>(await (await stakingToken(canisterId, true)).harvest());
}

export async function stakingTokenWithdraw(canisterId: string, amount: bigint) {
  return resultFormat<string>(await (await stakingToken(canisterId, true)).withdraw(amount));
}

/*  records */
export async function getStakingTokenTransactions(
  canisterId: string,
  principal: Principal | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<StakingPoolTransaction>>(
    await (
      await stakingToken(canisterId)
    ).findStakingRecordPage(availableArgsNull<Principal>(principal), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenTransactions(canisterId, principal, offset, limit);
    }, [canisterId, offset, limit, principal]),
    reload,
  );
}

export async function getStakingTokenClaimTransactions(
  canisterId: string,
  principal: Principal | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<StakingPoolTransaction>>(
    await (
      await stakingToken(canisterId)
    ).findRewardRecordPage(availableArgsNull<Principal>(principal), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenClaimTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenClaimTransactions(canisterId!, principal, offset, limit);
    }, [canisterId, offset, limit, principal]),
    reload,
  );
}
