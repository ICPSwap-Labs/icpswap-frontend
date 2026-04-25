import { Principal } from "@icp-sdk/core/principal";
import { farm, farmController, farmIndex } from "@icpswap/actor";
import { AnonymousPrincipal } from "@icpswap/constants";
import type {
  CreateFarmArgs,
  FarmDepositArgs,
  FarmFilterCondition,
  FarmInfo,
  FarmRewardMetadata,
  FarmState,
  FarmStatusArgs,
  FarmTvl,
  FarmUserTvl,
  InitFarmArgs,
  Null,
  PaginationResult,
  StakingFarmDistributeTransaction,
  StakingFarmStakeTransaction,
} from "@icpswap/types";
import { isAvailablePageArgs, optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getUserFarmInfo(canisterId: string, principal: string) {
  const farmResult = await (await farm(canisterId)).getFarmInfo(principal);
  return resultFormat<FarmInfo>(farmResult).data;
}

export function useUserFarmInfo(
  canisterId: string | Null,
  principal: string | Null,
  reload?: boolean,
): UseQueryResult<FarmInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useUserFarmInfo", canisterId, principal, reload],
    queryFn: async () => {
      if (!principal || !canisterId) return undefined;
      return await getUserFarmInfo(canisterId, principal);
    },
    enabled: !!principal && !!canisterId,
  });
}

export async function getFarmInfo(canisterId: string) {
  return await getUserFarmInfo(canisterId, AnonymousPrincipal);
}

export function useFarmInfo(canisterId: string | Null, reload?: boolean): UseQueryResult<FarmInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmInfo", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getUserFarmInfo(canisterId, AnonymousPrincipal);
    },
    enabled: !!canisterId,
  });
}

export async function getFarmUserPositions(canisterId: string, principal: string) {
  return resultFormat<Array<FarmDepositArgs>>(await (await farm(canisterId)).getUserDeposits(Principal.from(principal)))
    .data;
}

export function useFarmUserPositions(
  canisterId: string | undefined,
  principal: string | undefined,
  refresh?: number | boolean,
): UseQueryResult<FarmDepositArgs[] | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmUserPositions", canisterId, principal, refresh],
    queryFn: async () => {
      if (!canisterId || !principal) return undefined;
      return await getFarmUserPositions(canisterId, principal);
    },
    enabled: !!canisterId && !!principal,
  });
}

export async function getFarmTVL(canisterId: string) {
  return resultFormat<FarmTvl>(await (await farm(canisterId)).getTVL()).data;
}

export function useFarmTVL(
  canisterId: string | undefined,
  reload?: boolean,
): UseQueryResult<FarmTvl | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmTVL", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;

      return await getFarmTVL(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getFarmUserTVL(canisterId: string, principal: string) {
  return resultFormat<FarmUserTvl>(await (await farm(canisterId)).getUserTVL(Principal.fromText(principal))).data;
}

export function useFarmUserTVL(
  canisterId: string | undefined,
  principal: string | undefined,
  reload?: boolean,
): UseQueryResult<FarmUserTvl | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmUserTVL", canisterId, principal, reload],
    queryFn: async () => {
      if (!canisterId || !principal) return undefined;

      return await getFarmUserTVL(canisterId, principal);
    },
    enabled: !!canisterId && !!principal,
  });
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
  reload?: boolean,
): UseQueryResult<V3FarmRewardMeta | undefined, Error> {
  return useQuery({
    queryKey: ["useV3FarmRewardMeta", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;

      return resultFormat<V3FarmRewardMeta>(await (await farm(canisterId)).getRewardMeta()).data;
    },
    enabled: !!canisterId,
  });
}

export async function getV3UserFarmRewardInfo(canisterId: string, positionIds: bigint[]) {
  return resultFormat<bigint>(await (await farm(canisterId)).getRewardInfo(positionIds)).data;
}

export function useV3UserFarmRewardInfo(
  canisterId: string | undefined,
  positionIds: bigint[] | undefined,
  reload?: boolean,
): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useV3UserFarmRewardInfo", canisterId, positionIds, reload],
    queryFn: async () => {
      if (!canisterId || !positionIds?.length) return undefined;
      return await getV3UserFarmRewardInfo(canisterId, positionIds);
    },
    enabled: !!canisterId && !!positionIds?.length,
  });
}

export async function createV3Farm(args: CreateFarmArgs) {
  return resultFormat<string>(await (await farmController(true)).create(args));
}

export async function getFarms(condition: FarmFilterCondition) {
  return resultFormat<Principal[]>(await (await farmIndex()).getFarmsByConditions(condition)).data;
}

export function useFarms(
  condition: FarmFilterCondition | undefined,
  reload?: boolean | number,
): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useFarms", condition, reload],
    queryFn: async () => {
      if (!condition) return undefined;
      return await getFarms(condition);
    },
    enabled: !!condition,
  });
}

export function useAllFarms(reload?: boolean | number): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useAllFarms", reload],
    queryFn: async () => {
      return await getFarms({ user: [], pool: [], status: [], rewardToken: [] });
    },
  });
}

export async function getFarmsByState(state: FarmState | undefined) {
  return resultFormat<Array<Principal>>(
    await (await farmIndex()).getFarms(
      optionalArg<FarmStatusArgs>(state ? ({ [state]: null } as FarmStatusArgs) : undefined),
    ),
  ).data;
}

export function useFarmsByState(
  state: FarmState | undefined,
  reload?: boolean | number,
): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmsByState", state, reload],
    queryFn: async () => {
      if (!state) return undefined;
      return await getFarmsByState(state);
    },
    enabled: !!state,
  });
}

export async function getV3FarmRewardMetadata(canisterId: string) {
  return resultFormat<FarmRewardMetadata>(await (await farm(canisterId)).getRewardMeta()).data;
}

export function useV3FarmRewardMetadata(
  canisterId: string | undefined,
): UseQueryResult<FarmRewardMetadata | undefined, Error> {
  return useQuery({
    queryKey: ["useV3FarmRewardMetadata", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;

      return await getV3FarmRewardMetadata(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getFarmInitArgs(canisterId: string) {
  return resultFormat<InitFarmArgs>(await (await farm(canisterId)).getInitArgs()).data;
}

export function useFarmInitArgs(canisterId: string | undefined): UseQueryResult<InitFarmArgs | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmInitArgs", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;

      return await getFarmInitArgs(canisterId);
    },
    enabled: !!canisterId,
  });
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
): UseQueryResult<PaginationResult<StakingFarmStakeTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useV3FarmStakeRecords", storageId, offset, limit, from, reload],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmStakeRecords(storageId, offset, limit, from);
    },
    enabled: isAvailablePageArgs(offset, limit) && !!storageId,
  });
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
): UseQueryResult<PaginationResult<StakingFarmDistributeTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useV3FarmDistributeRecords", storageId, offset, limit, owner, reload],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit) || !storageId) return undefined;
      return await getV3FarmDistributeRecords(storageId, offset, limit, owner);
    },
    enabled: isAvailablePageArgs(offset, limit) && !!storageId,
  });
}

export function useFarmCycles(
  farmId: string | undefined,
): UseQueryResult<{ balance: bigint; available: bigint } | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmCycles", farmId],
    queryFn: async () => {
      if (!farmId) return undefined;
      return resultFormat<{ balance: bigint; available: bigint }>(await (await farm(farmId)).getCycleInfo()).data;
    },
    enabled: !!farmId,
  });
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
export function useFarmUserRewards(
  farmId: string | undefined,
  principal: Principal | undefined,
  refresh?: number,
): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmUserRewards", farmId, principal?.toString(), refresh],
    queryFn: async () => {
      if (!farmId || !principal) return undefined;
      return await getFarmUserRewards(farmId, principal);
    },
    enabled: !!farmId && !!principal,
  });
}

export interface GetFarmsByFilterArgs {
  state: FarmState | Null;
  pair: string | Null;
  token: string | Null;
  user: string | Null;
}

export async function getFarmsByFilter({ state, pair, token, user }: GetFarmsByFilterArgs) {
  return resultFormat<Array<Principal>>(
    await (await farmIndex()).getFarmsByConditions({
      status: state
        ? optionalArg<FarmStatusArgs[]>(
            state === "FINISHED"
              ? ([{ FINISHED: null }, { CLOSED: null }] as FarmStatusArgs[])
              : ([{ [state]: null }] as FarmStatusArgs[]),
          )
        : [],
      rewardToken: token ? optionalArg<Principal>(Principal.fromText(token)) : [],
      pool: pair ? optionalArg<Principal>(Principal.fromText(pair)) : [],
      user: user ? optionalArg<Principal>(Principal.fromText(user)) : [],
    }),
  ).data;
}

export function useFarmsByFilter({
  state,
  pair,
  token,
  user,
}: GetFarmsByFilterArgs): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmsByFilter", state, pair, token, user],
    queryFn: async () => {
      return await getFarmsByFilter({ state, pair, token, user });
    },
  });
}

export * from "./useFarmAprChart";
export * from "./useFarmInfo";
export * from "./useFarmState";
export * from "./useFarmsByPool";
export * from "./useFarmTotalAmount";
export * from "./useUserFarms";
