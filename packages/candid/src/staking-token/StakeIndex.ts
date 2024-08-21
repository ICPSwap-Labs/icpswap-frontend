import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface APRInfo {
  apr: number;
  day: bigint;
  rewardPerTime: bigint;
  time: bigint;
  stakingPool: Principal;
  stakingTokenPriceUSD: number;
  rewardTokenPriceUSD: number;
  stakingTokenDecimals: bigint;
  stakingTokenAmount: number;
  rewardTokenDecimals: bigint;
}
export interface CycleInfo {
  balance: bigint;
  available: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export interface Page {
  content: Array<StakingPoolInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<UserPool>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PublicUserInfo {
  pendingReward: bigint;
  lastRewardTime: bigint;
  stakeAmount: bigint;
  rewardTokenBalance: bigint;
  rewardDebt: bigint;
  lastStakeTime: bigint;
  stakeTokenBalance: bigint;
}
export type Result = { ok: boolean } | { err: string };
export type Result_1 = { ok: bigint } | { err: string };
export type Result_2 = { ok: Page } | { err: string };
export type Result_3 = { ok: Page_1 } | { err: Page_1 };
export type Result_4 = { ok: [bigint, bigint, Principal] } | { err: string };
export type Result_5 = { ok: Array<APRInfo> } | { err: string };
export type Result_6 = { ok: CycleInfo } | { err: Error };
export interface StakingPoolInfo {
  stakingTokenSymbol: string;
  startTime: bigint;
  rewardTokenSymbol: string;
  creator: Principal;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  name: string;
  createTime: bigint;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
  canisterId: Principal;
}
export interface Token {
  address: string;
  standard: string;
}
export interface UserPool {
  userInfo: PublicUserInfo;
  stakingToken: Token;
  rewardToken: Token;
  owner: Principal;
  stakingPool: Principal;
}
export interface _SERVICE {
  computeStakingPool: ActorMethod<[], Result_1>;
  getCycleInfo: ActorMethod<[], Result_6>;
  getUSDPrice: ActorMethod<[string], number>;
  getVersion: ActorMethod<[], string>;
  queryAPR: ActorMethod<[Principal, bigint, bigint], Result_5>;
  queryIndexInfo: ActorMethod<[], Result_4>;
  queryPool: ActorMethod<[Principal, bigint, bigint, [] | [string], [] | [string]], Result_3>;
  queryStakingPool: ActorMethod<[bigint, bigint], Result_2>;
  syncStakingPool: ActorMethod<[], Result_1>;
  updateUser: ActorMethod<[Principal, PublicUserInfo], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
