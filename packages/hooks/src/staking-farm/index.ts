import { useCallsData, usePaginationAllData } from "../useCallData";
import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { v3Farm, v3FarmController } from "@icpswap/actor";
import type {
  StakingFarmDepositArgs,
  StakingFarmInfo,
  StakingFarmStakeTransaction,
  StakingFarmDistributeTransaction,
  FarmMetadata,
} from "@icpswap/types";
import type { ActorIdentity, PaginationResult } from "@icpswap/types";

export async function getV3UserFarmInfo(canisterId: string, principal: string) {
  return resultFormat<StakingFarmInfo>(
    await (await v3Farm(canisterId)).getFarmInfo(principal)
  ).data;
}

export function useV3UserFarmInfo(
  canisterId: string | undefined,
  principal: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!principal || !canisterId) return undefined;
      return await getV3UserFarmInfo(canisterId, principal);
    }, [principal, canisterId]),
    reload
  );
}

export async function getFarmUserPositions(
  canisterId: string,
  principal: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<StakingFarmDepositArgs>>(
    await (
      await v3Farm(canisterId)
    ).getUserPositions(Principal.from(principal), BigInt(offset), BigInt(limit))
  ).data;
}

export function useFarmUserPositions(
  canisterId: string | undefined,
  principal: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal || !isAvailablePageArgs(offset, limit))
        return undefined;

      return await getFarmUserPositions(canisterId, principal, offset, limit);
    }, [canisterId, principal, offset, limit]),
    reload
  );
}

export function useFarmUserAllPositions(
  canisterId: string | undefined,
  user: string | undefined,
  reload?: boolean
) {
  const callback = useCallback(
    async (offset: number, limit: number) => {
      if (!canisterId || !user) return undefined;
      return await getFarmUserPositions(canisterId, user, offset, limit);
    },
    [canisterId, user]
  );

  return usePaginationAllData<StakingFarmDepositArgs>(callback, 300, reload);
}

export async function getFarmTVL(canisterId: string) {
  return resultFormat<{ stakedTokenTVL: number; rewardTokenTVL: number }>(
    await (await v3Farm(canisterId)).getTVL()
  ).data;
}

export function useFarmTVL(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return await getFarmTVL(canisterId);
    }, [canisterId]),
    reload
  );
}

export async function getFarmUserTVL(canisterId: string, principal: string) {
  return resultFormat<number>(
    await (await v3Farm(canisterId)).getUserTVL(Principal.fromText(principal))
  ).data;
}

export function useFarmUserTVL(
  canisterId: string | undefined,
  principal: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal) return undefined;

      return await getFarmUserTVL(canisterId, principal);
    }, [canisterId, principal]),
    reload
  );
}

export type V3FarmRewardMeta = {
  secondPerCycle: bigint;
  totalRewardBalance: bigint;
  rewardPerCycle: bigint;
  totalRewardClaimed: bigint;
  totalCycleCount: bigint;
  currentCycleCount: bigint;
  totalReward: bigint;
  totalRewardUnclaimed: bigint;
};

export function useV3FarmRewardMeta(
  canisterId: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return resultFormat<V3FarmRewardMeta>(
        await (await v3Farm(canisterId!)).getRewardMeta()
      ).data;
    }, [canisterId]),
    reload
  );
}

export async function getV3UserFarmRewardInfo(
  canisterId: string,
  positionIds: bigint[]
) {
  return resultFormat<bigint>(
    await (await v3Farm(canisterId!)).getRewardInfo(positionIds)
  ).data;
}

export function useV3UserFarmRewardInfo(
  canisterId: string | undefined,
  positionIds: bigint[] | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !positionIds?.length) return undefined;
      return await getV3UserFarmRewardInfo(canisterId, positionIds);
    }, [canisterId, positionIds]),
    reload
  );
}

export type CreateFarmArgs = {
  rewardToken: { address: string; standard: string };
  rewardAmount: bigint;
  rewardPool: string;
  pool: string;
  startTime: bigint;
  endTime: bigint;
  secondPerCycle: bigint;
  token0AmountLimit: bigint;
  token1AmountLimit: bigint;
  priceInsideLimit: boolean;
};

export async function createV3Farm(
  identity: ActorIdentity,
  args: CreateFarmArgs
) {
  return resultFormat<string>(
    await (
      await v3FarmController(identity)
    ).create(
      args.rewardToken,
      args.rewardAmount,
      args.rewardPool,
      args.pool,
      args.startTime,
      args.endTime,
      args.secondPerCycle,
      args.token0AmountLimit,
      args.token1AmountLimit,
      args.priceInsideLimit
    )
  );
}

export async function getV3StakingFarms(
  offset: number,
  limit: number,
  state: string
) {
  return resultFormat<PaginationResult<StakingFarmInfo>>(
    await (
      await v3FarmController()
    ).getFarmList(BigInt(offset), BigInt(limit), state)
  ).data;
}

export function useV3StakingFarms(
  offset: number,
  limit: number,
  state: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !state) return undefined;
      return await getV3StakingFarms(offset, limit, state);
    }, [offset, limit, state]),
    reload
  );
}

export async function getV3FarmMetadata(canisterId: string) {
  return resultFormat<FarmMetadata>(
    await (await v3Farm(canisterId)).getRewardMeta()
  ).data;
}

export function useV3FarmMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getV3FarmMetadata(canisterId!);
    }, [canisterId])
  );
}

/* v3 farm storage */

export async function getV3FarmStakeRecords(
  canisterId: string,
  offset: number,
  limit: number,
  from: string
) {
  return resultFormat<PaginationResult<StakingFarmStakeTransaction>>(
    await (
      await v3Farm(canisterId)
    ).getStakeRecord(BigInt(offset), BigInt(limit), from)
  ).data;
}

export function useV3FarmStakeRecords(
  storageId: string | undefined,
  offset: number,
  limit: number,
  from: string = "",
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmStakeRecords(storageId, offset, limit, from);
    }, [offset, limit, from, storageId]),
    reload
  );
}

export async function getV3FarmDistributeRecords(
  canisterId: string,
  offset: number,
  limit: number,
  owner: string
) {
  return resultFormat<PaginationResult<StakingFarmDistributeTransaction>>(
    await (
      await v3Farm(canisterId)
    ).getDistributeRecord(BigInt(offset), BigInt(limit), owner)
  ).data;
}

export function useV3FarmDistributeRecords(
  storageId: string | undefined,
  offset: number,
  limit: number,
  owner: string = "",
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmDistributeRecords(storageId, offset, limit, owner);
    }, [offset, limit, owner, storageId]),
    reload
  );
}

/* v3 farm storage */
