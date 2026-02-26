import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, optionalArg } from "@icpswap/utils";
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
  StakeGlobalDataInfo,
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
    ).findStakingPoolPage(optionalArg<bigint>(state), BigInt(offset), BigInt(limit)),
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

export interface GetStakePoolsProps {
  state: bigint | undefined;
  offset: number;
  limit: number;
  rewardTokenId?: string | null;
  stakeTokenId?: string | null;
}

export async function getStakePools({ state, offset, limit, rewardTokenId, stakeTokenId }: GetStakePoolsProps) {
  return resultFormat<PaginationResult<StakingPoolControllerPoolInfo>>(
    await (
      await stakingPoolController()
    ).findStakingPoolPageV2(
      optionalArg<bigint>(state),
      BigInt(offset),
      BigInt(limit),
      optionalArg<string>(stakeTokenId),
      optionalArg<string>(rewardTokenId),
    ),
  ).data;
}

export interface UseStakePoolsProps {
  state: bigint | undefined;
  offset: number;
  limit: number;
  rewardTokenId?: string | null;
  stakeTokenId?: string | null;
}

export function useStakePools({ state, offset, limit, rewardTokenId, stakeTokenId }: UseStakePoolsProps) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakePools({ state, offset, limit, rewardTokenId, stakeTokenId });
    }, [offset, limit, state, rewardTokenId, stakeTokenId]),
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

// export async function getStakingPoolAllUserInfo(canisterId: string, offset: number, limit: number) {
//   return resultFormat<StakingPoolUserInfo>(
//     await (await stakingPool(canisterId)).findAllUserInfo(BigInt(offset), BigInt(limit)),
//   ).data;
// }

// export function useStakingPoolAllUserInfo(
//   canisterId: string | undefined,
//   offset: number,
//   limit: number,
//   reload?: boolean,
// ) {
//   return useCallsData(
//     useCallback(async () => {
//       if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
//       return await getStakingPoolAllUserInfo(canisterId!, offset, limit);
//     }, [canisterId, offset, limit]),
//     reload,
//   );
// }

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

/**
 * @description claim the failed deposit token
 * @param canisterId - pool canister id
 * @returns
 */
export async function stakingPoolClaim(canisterId: string) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).claim());
}

export async function stakingPoolDeposit(canisterId: string) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).deposit());
}

export async function stakingPoolDepositFrom(canisterId: string, amount: bigint) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).depositFrom(amount));
}

export async function stakingPoolHarvest(canisterId: string) {
  return resultFormat<bigint>(await (await stakingPool(canisterId, true)).harvest());
}

export async function stakingTokenStake(canisterId: string) {
  return resultFormat<bigint>(await (await stakingPool(canisterId, true)).stake());
}

/**
 * @description withdraw the token for staked token and reward token
 * @export
 * @param {string} canisterId - pool canister id
 * @param {boolean} isStakeToken - staked token is true, reward token is false
 * @param {bigint} amount - withdraw amount
 * @return {*}
 */
export async function stakingPoolWithdraw(canisterId: string, isStakeToken: boolean, amount: bigint) {
  return resultFormat<string>(await (await stakingPool(canisterId, true)).withdraw(isStakeToken, amount));
}

export async function stakingPoolUnstake(canisterId: string, amount: bigint) {
  return resultFormat<bigint>(await (await stakingPool(canisterId, true)).unstake(amount));
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
    ).findStakingRecordPage(optionalArg<Principal>(principal), BigInt(offset), BigInt(limit)),
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
    ).findRewardRecordPage(optionalArg<Principal>(principal), BigInt(offset), BigInt(limit)),
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

  return resultFormat<boolean>(await (await stakingPool(canisterId, true)).claim());
}

export async function getStakePoolStatInfo(principal: string) {
  return resultFormat<StakeGlobalDataInfo>(
    await (await stakingPoolController()).getPoolStatInfo(Principal.fromText(principal)),
  ).data;
}

export function useStakePoolStatInfo(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakePoolStatInfo(canisterId);
    }, [canisterId]),
    reload,
  );
}
