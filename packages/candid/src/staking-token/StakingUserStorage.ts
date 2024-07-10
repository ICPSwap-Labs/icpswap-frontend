import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

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
export type Result_1 = { ok: Page } | { err: Page };
export type Result_2 = { ok: CycleInfo } | { err: Error };
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
  getCycleInfo: ActorMethod<[], Result_2>;
  getVersion: ActorMethod<[], string>;
  queryPool: ActorMethod<[Principal, bigint, bigint, [] | [string], [] | [string]], Result_1>;
  updateUser: ActorMethod<[Principal, PublicUserInfo], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
