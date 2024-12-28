import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, availableArgsNull } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { farm, farmController, farmIndex } from "@icpswap/actor";
import type {
  FarmDepositArgs,
  FarmInfo,
  CreateFarmArgs,
  StakingFarmStakeTransaction,
  StakingFarmDistributeTransaction,
  FarmRewardMetadata,
  PaginationResult,
  FarmTvl,
  InitFarmArgs,
  FarmUserTvl,
  FarmFilterCondition,
  FarmState,
  FarmStatusArgs,
  Null,
} from "@icpswap/types";
import { AnonymousPrincipal } from "@icpswap/constants";

import { useCallsData } from "../useCallData";

export async function getUserFarmInfo(canisterId: string, principal: string) {
  const farmResult = await (await farm(canisterId)).getFarmInfo(principal);
  return resultFormat<FarmInfo>(farmResult).data;
}

export function useV3UserFarmInfo(canisterId: string | Null, principal: string | Null, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!principal || !canisterId) return undefined;
      return await getUserFarmInfo(canisterId, principal);
    }, [principal, canisterId]),
    reload,
  );
}

export async function getFarmInfo(canisterId: string) {
  return await getUserFarmInfo(canisterId, AnonymousPrincipal);
}

export function useFarmInfo(canisterId: string | Null, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getUserFarmInfo(canisterId, AnonymousPrincipal);
    }, [canisterId]),
    reload,
  );
}

export async function getFarmUserPositions(canisterId: string, principal: string) {
  return resultFormat<Array<FarmDepositArgs>>(await (await farm(canisterId)).getUserDeposits(Principal.from(principal)))
    .data;
}

export function useFarmUserPositions(
  canisterId: string | undefined,
  principal: string | undefined,
  refresh?: number | boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal) return undefined;
      return await getFarmUserPositions(canisterId, principal);
    }, [canisterId, principal]),
    refresh,
  );
}

export async function getFarmTVL(canisterId: string) {
  return resultFormat<FarmTvl>(await (await farm(canisterId)).getTVL()).data;
}

export function useFarmTVL(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return await getFarmTVL(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getFarmUserTVL(canisterId: string, principal: string) {
  return resultFormat<FarmUserTvl>(await (await farm(canisterId)).getUserTVL(Principal.fromText(principal))).data;
}

export function useFarmUserTVL(canisterId: string | undefined, principal: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal) return undefined;
      return await getFarmUserTVL(canisterId, principal);
    }, [canisterId, principal]),
    reload,
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

export function useV3FarmRewardMeta(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return resultFormat<V3FarmRewardMeta>(await (await farm(canisterId!)).getRewardMeta()).data;
    }, [canisterId]),
    reload,
  );
}

export async function getV3UserFarmRewardInfo(canisterId: string, positionIds: bigint[]) {
  return resultFormat<bigint>(await (await farm(canisterId!)).getRewardInfo(positionIds)).data;
}

export function useV3UserFarmRewardInfo(
  canisterId: string | undefined,
  positionIds: bigint[] | undefined,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !positionIds?.length) return undefined;
      return await getV3UserFarmRewardInfo(canisterId, positionIds);
    }, [canisterId, positionIds]),
    reload,
  );
}

export async function createV3Farm(args: CreateFarmArgs) {
  return resultFormat<string>(await (await farmController(true)).create(args));
}

export async function getFarms(condition: FarmFilterCondition) {
  return resultFormat<Principal[]>(await (await farmIndex()).getFarmsByConditions(condition)).data;
}

export function useFarms(condition: FarmFilterCondition | undefined, reload?: boolean | number) {
  return useCallsData(
    useCallback(async () => {
      if (!condition) return undefined;
      return await getFarms(condition);
    }, [condition]),
    reload,
  );
}

export function useAllFarms(reload?: boolean | number) {
  return useCallsData(
    useCallback(async () => {
      return await getFarms({ user: [], pool: [], status: [], rewardToken: [] });
    }, []),
    reload,
  );
}

export async function getFarmsByState(state: FarmState | undefined) {
  return resultFormat<Array<Principal>>(
    await (
      await farmIndex()
    ).getFarms(availableArgsNull<FarmStatusArgs>(state ? ({ [state]: null } as FarmStatusArgs) : undefined)),
  ).data;
}

export function useFarmsByState(state: FarmState | undefined, reload?: boolean | number) {
  return useCallsData(
    useCallback(async () => {
      if (!state) return undefined;
      return await getFarmsByState(state);
    }, [state]),
    reload,
  );
}

// export async function getAllFarms() {
//   return resultFormat<Principal[]>(await (await farmController()).getAllFarms()).data;
// }

// export function useAllFarms(reload?: boolean | number) {
//   return useCallsData(
//     useCallback(async () => {
//       return await getAllFarms();
//     }, []),
//     reload,
//   );
// }

export async function getV3FarmRewardMetadata(canisterId: string) {
  return resultFormat<FarmRewardMetadata>(await (await farm(canisterId)).getRewardMeta()).data;
}

export function useV3FarmRewardMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getV3FarmRewardMetadata(canisterId!);
    }, [canisterId]),
  );
}

export async function getFarmInitArgs(canisterId: string) {
  return resultFormat<InitFarmArgs>(await (await farm(canisterId)).getInitArgs()).data;
}

export function useFarmInitArgs(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getFarmInitArgs(canisterId!);
    }, [canisterId]),
  );
}

/* v3 farm storage */

export async function getV3FarmStakeRecords(canisterId: string, offset: number, limit: number, from: string) {
  return resultFormat<PaginationResult<StakingFarmStakeTransaction>>(
    await (await farm(canisterId)).getStakeRecord(BigInt(offset), BigInt(limit), from),
  ).data;
}

export function useV3FarmStakeRecords(
  storageId: string | undefined,
  offset: number,
  limit: number,
  from = "",
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmStakeRecords(storageId, offset, limit, from);
    }, [offset, limit, from, storageId]),
    reload,
  );
}

export async function getV3FarmDistributeRecords(canisterId: string, offset: number, limit: number, owner: string) {
  return resultFormat<PaginationResult<StakingFarmDistributeTransaction>>(
    await (await farm(canisterId)).getDistributeRecord(BigInt(offset), BigInt(limit), owner),
  ).data;
}

export function useV3FarmDistributeRecords(
  storageId: string | undefined,
  offset: number,
  limit: number,
  owner = "",
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmDistributeRecords(storageId, offset, limit, owner);
    }, [offset, limit, owner, storageId]),
    reload,
  );
}

export function useFarmCycles(farmId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!farmId) return undefined;
      return resultFormat<{ balance: bigint; available: bigint }>(await (await farm(farmId)).getCycleInfo()).data;
    }, [farmId]),
  );
}

export async function farmStake(farmId: string, positionIndex: bigint) {
  const result = await (await farm(farmId, true)).stake(positionIndex);
  return resultFormat<string>(result);
}

export async function farmUnstake(farmId: string, positionIndex: bigint) {
  const result = await (await farm(farmId, true)).unstake(positionIndex);
  return resultFormat<string>(result);
}

/**
 * @description withdraw the total reward of user
 * @param {string} farmId farm pool canister id
 * @return {*}
 */
export async function farmWithdraw(farmId: string) {
  const result = await (await farm(farmId, true)).withdraw();
  return resultFormat<bigint>(result);
}

/**
 * @description Get user unclaimed rewards
 * @param farmId farm pool canister id
 * @param principal user principal ID
 * @returns user unclaimed rewards amount
 */
export async function getFarmUserRewards(farmId: string, principal: Principal) {
  const result = await (await farm(farmId, true)).getUserRewardBalance(principal);
  return resultFormat<bigint>(result).data;
}

/**
 * @description Use user unclaimed rewards
 * @param farmId farm pool canister id
 * @param principal user principal ID
 * @returns user unclaimed rewards amount
 */
export function useFarmUserRewards(farmId: string | undefined, principal: Principal | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!farmId || !principal) return undefined;
      return await getFarmUserRewards(farmId, principal);
    }, [farmId, principal]),
    refresh,
  );
}

export interface GetFarmsByFilterArgs {
  state: FarmState | Null;
  pair: string | Null;
  token: string | Null;
  user: string | Null;
}

export async function getFarmsByFilter({ state, pair, token, user }: GetFarmsByFilterArgs) {
  return resultFormat<Array<Principal>>(
    await (
      await farmIndex()
    ).getFarmsByConditions({
      status: state
        ? availableArgsNull<FarmStatusArgs[]>(
            state === "FINISHED"
              ? ([{ FINISHED: null }, { CLOSED: null }] as FarmStatusArgs[])
              : ([{ [state]: null }] as FarmStatusArgs[]),
          )
        : [],
      rewardToken: token ? availableArgsNull<Principal>(Principal.fromText(token)) : [],
      pool: pair ? availableArgsNull<Principal>(Principal.fromText(pair)) : [],
      user: user ? availableArgsNull<Principal>(Principal.fromText(user)) : [],
    }),
  ).data;
}

export function useFarmsByFilter({ state, pair, token, user }: GetFarmsByFilterArgs) {
  return useCallsData(
    useCallback(async () => {
      return await getFarmsByFilter({ state, pair, token, user });
    }, [state, pair, token, user]),
  );
}

export * from "./useFarmState";
export * from "./useFarmTotalAmount";
export * from "./useFarmInfo";
export * from "./useUserFarms";
export * from "./useFarmsByPool";
export * from "./useFarmAprChart";
