import { Principal } from "@icp-sdk/core/principal";
import { stakingPool, stakingPoolController } from "@icpswap/actor";
import type {
  CreateStakingPoolArgs,
  PaginationResult,
  StakeGlobalDataInfo,
  StakingPoolControllerPoolInfo,
  StakingPoolCycle,
  StakingPoolGlobalData,
  StakingPoolInfo,
  StakingPoolTransaction,
  StakingPoolUserInfo,
} from "@icpswap/types";
import { isAvailablePageArgs, optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/* token controller */
export async function createStakingPool(args: CreateStakingPoolArgs) {
  return resultFormat<string>(await (await stakingPoolController(true)).createStakingPool(args));
}

export async function getStakingPools(state: bigint | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolControllerPoolInfo>>(
    await (await stakingPoolController()).findStakingPoolPage(
      optionalArg<bigint>(state),
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useStakingPools(
  state: bigint | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<StakingPoolControllerPoolInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPools", state?.toString(), offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPools(state, offset, limit);
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
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
    await (await stakingPoolController()).findStakingPoolPageV2(
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

export function useStakePools({
  state,
  offset,
  limit,
  rewardTokenId,
  stakeTokenId,
}: UseStakePoolsProps): UseQueryResult<PaginationResult<StakingPoolControllerPoolInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useStakePools", state?.toString(), offset, limit, rewardTokenId, stakeTokenId],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakePools({ state, offset, limit, rewardTokenId, stakeTokenId });
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export async function getStakingPoolGlobalData() {
  return resultFormat<StakingPoolGlobalData>(await (await stakingPoolController()).getGlobalData()).data;
}

export function useStakingPoolGlobalData(reload?: boolean): UseQueryResult<StakingPoolGlobalData | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolGlobalData", reload],
    queryFn: async () => {
      return await getStakingPoolGlobalData();
    },
  });
}

export async function getStakingPoolFromController(canisterId: string) {
  return resultFormat<StakingPoolControllerPoolInfo>(
    await (await stakingPoolController()).getStakingPool(Principal.fromText(canisterId)),
  ).data;
}

export function useStakingPoolInfoFromController(
  canisterId: string | undefined,
): UseQueryResult<StakingPoolControllerPoolInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolInfoFromController", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolFromController(canisterId);
    },
    enabled: !!canisterId,
  });
}

/* token pool */
export async function getStakingTokenPool(canisterId: string) {
  return resultFormat<StakingPoolInfo>(await (await stakingPool(canisterId)).getPoolInfo()).data;
}

export function useStakingTokenPool(
  canisterId: string | undefined,
  reload?: boolean,
): UseQueryResult<StakingPoolInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingTokenPool", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getStakingTokenPool(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getStakingTokenUserInfo(canisterId: string, principal: Principal) {
  return resultFormat<StakingPoolUserInfo>(await (await stakingPool(canisterId)).getUserInfo(principal)).data;
}

export function useStakingTokenUserInfo(
  canisterId: string | undefined,
  principal: Principal | undefined,
  reload?: boolean,
): UseQueryResult<StakingPoolUserInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingTokenUserInfo", canisterId, principal?.toString(), reload],
    queryFn: async () => {
      if (!canisterId || !principal) return undefined;
      return await getStakingTokenUserInfo(canisterId, principal);
    },
    enabled: !!canisterId && !!principal,
  });
}

export async function getStakingPoolCycles(canisterId: string) {
  return resultFormat<StakingPoolCycle>(await (await stakingPool(canisterId)).getCycleInfo()).data;
}

export function useStakingPoolCycles(
  canisterId: string | undefined,
  reload?: boolean,
): UseQueryResult<StakingPoolCycle | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolCycles", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolCycles(canisterId);
    },
    enabled: !!canisterId,
  });
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
    await (await stakingPool(canisterId)).findStakingRecordPage(
      optionalArg<Principal>(principal),
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useStakingPoolTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
): UseQueryResult<PaginationResult<StakingPoolTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolTransactions", canisterId, principal?.toString(), offset, limit, reload],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPoolTransactions(canisterId, principal, offset, limit);
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
}

export async function getStakingPoolClaimTransactions(
  canisterId: string,
  principal: Principal | undefined,
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<StakingPoolTransaction>>(
    await (await stakingPool(canisterId)).findRewardRecordPage(
      optionalArg<Principal>(principal),
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useStakingPoolClaimTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
): UseQueryResult<PaginationResult<StakingPoolTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolClaimTransactions", canisterId, principal?.toString(), offset, limit, reload],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingPoolClaimTransactions(canisterId, principal, offset, limit);
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
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

export function useStakePoolStatInfo(
  canisterId: string | undefined,
  reload?: boolean,
): UseQueryResult<StakeGlobalDataInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useStakePoolStatInfo", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getStakePoolStatInfo(canisterId);
    },
    enabled: !!canisterId,
  });
}
