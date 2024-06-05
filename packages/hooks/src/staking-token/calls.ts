import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, availableArgsNull } from "@icpswap/utils";
import { stakingPoolController, stakingPool } from "@icpswap/actor";
import type {
  CreateStakingPoolArgs,
  StakingPoolInfo,
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
export async function createStakingPool(args: CreateStakingPoolArgs) {
  return resultFormat<string>(await (await stakingPoolController(true)).createStakingPool(args));
}

export async function getStakingPools(state: bigint | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolControllerPoolInfo>>(
    await (
      await stakingPoolController()
    ).findStakingPoolPage(availableArgsNull<bigint>(state), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPools(state: bigint | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPools(state, offset, limit);
    }, [offset, limit, state]),
  );
}

export async function getStakingPoolGlobalData() {
  return resultFormat<StakingPoolGlobalData>(await (await stakingPoolController()).getGlobalData()).data;
}

export function useStakingPoolGlobalData(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getStakingPoolGlobalData();
    }, []),
    reload,
  );
}

export async function getStakingPoolFromController(canisterId: string) {
  return resultFormat<StakingPoolControllerPoolInfo>(
    await (await stakingPoolController()).getStakingPool(Principal.fromText(canisterId)),
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
  return resultFormat<StakingPoolInfo>(await (await stakingPool(canisterId)).getPoolInfo()).data;
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
  return resultFormat<StakingPoolUserInfo>(await (await stakingPool(canisterId)).getUserInfo(principal)).data;
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

export async function getStakingPoolAllUserInfo(canisterId: string, offset: number, limit: number) {
  return resultFormat<StakingPoolUserInfo>(
    await (await stakingPool(canisterId)).findAllUserInfo(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPoolAllUserInfo(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPoolAllUserInfo(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
    reload,
  );
}

export async function getStakingPoolCycles(canisterId: string) {
  return resultFormat<StakingPoolCycle>(await (await stakingPool(canisterId)).getCycleInfo()).data;
}

export function useStakingPoolCycles(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolCycles(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function stakingPoolClaim(canisterId: string) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).claim());
}

export async function stakingPoolDeposit(canisterId: string) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).stake());
}

export async function stakingPoolDepositFrom(canisterId: string, amount: bigint) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).stakeFrom(amount));
}

export async function stakingPoolHarvest(canisterId: string) {
  return resultFormat<bigint>(await (await stakingPool(canisterId, true)).harvest());
}

export async function stakingPoolWithdraw(canisterId: string, amount: bigint) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).unstake(amount));
}

/*  records */
export async function getStakingPoolTransactions(
  canisterId: string,
  principal: Principal | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<StakingPoolTransaction>>(
    await (
      await stakingPool(canisterId)
    ).findStakingRecordPage(availableArgsNull<Principal>(principal), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPoolTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPoolTransactions(canisterId, principal, offset, limit);
    }, [canisterId, offset, limit, principal]),
    reload,
  );
}

export async function getStakingPoolClaimTransactions(
  canisterId: string,
  principal: Principal | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<StakingPoolTransaction>>(
    await (
      await stakingPool(canisterId)
    ).findRewardRecordPage(availableArgsNull<Principal>(principal), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPoolClaimTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPoolClaimTransactions(canisterId!, principal, offset, limit);
    }, [canisterId, offset, limit, principal]),
    reload,
  );
}

export async function stakingPoolClaimRewards(canisterId: string, owner: Principal | undefined) {
  if (!owner) return resultFormat<boolean>({ err: "Principal is undefined" });
  console.log("claim reward canisterId: ", canisterId);
  console.log("claim reward owner: ", owner.toString());
  return resultFormat<boolean>(await (await stakingPool(canisterId, true)).claimReward(owner));
}
