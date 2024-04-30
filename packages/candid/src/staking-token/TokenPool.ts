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
export interface InitRequest {
  stakingTokenSymbol: string;
  startTime: bigint;
  rewardTokenSymbol: string;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  name: string;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
}
export interface Page {
  content: Array<Record>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<[Principal, PublicUserInfo]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PublicTokenPoolInfo {
  stakingTokenSymbol: string;
  startTime: bigint;
  lastRewardTime: bigint;
  totalDeposit: bigint;
  rewardTokenSymbol: string;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  stakingTokenFee: bigint;
  rewardDebt: bigint;
  rewardTokenFee: bigint;
  accPerShare: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
}
export interface PublicUserInfo {
  pendingReward: bigint;
  rewardDebt: bigint;
  amount: bigint;
}
export interface Record {
  to: Principal;
  stakingTokenSymbol: string;
  rewardTokenSymbol: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  transType: TransType;
  from: Principal;
  rewardStandard: string;
  timestamp: bigint;
  stakingTokenDecimals: bigint;
  amount: bigint;
  rewardTokenDecimals: bigint;
}
export type Result = { ok: bigint } | { err: string };
export type Result_1 = { ok: string } | { err: string };
export type Result_2 = { ok: boolean } | { err: string };
export type Result_3 = { ok: PublicTokenPoolInfo } | { err: string };
export type Result_4 = { ok: PublicUserInfo } | { err: string };
export type Result_5 = { ok: CycleInfo } | { err: Error };
export type Result_6 = { ok: Array<[Principal, bigint]> } | { err: string };
export type Result_7 = { ok: Array<Principal> } | { err: Error };
export type Result_8 = { ok: Page } | { err: string };
export type Result_9 = { ok: Page_1 } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export type TransType =
  | { withdraw: null }
  | { unstaking: null }
  | { staking: null }
  | { endIncentive: null }
  | { claim: null }
  | { unstakeTokenids: null }
  | { deposit: null }
  | { stakeTokenids: null }
  | { createIncentive: null }
  | { depositFrom: null };
export interface UpdateTokenPool {
  stakingTokenSymbol: string;
  startTime: bigint;
  rewardTokenSymbol: string;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
}
export interface _SERVICE {
  claim: ActorMethod<[], Result_1>;
  claimOf: ActorMethod<[Principal], Result_1>;
  clearErrorLog: ActorMethod<[], undefined>;
  clearLocks: ActorMethod<[], Result>;
  deposit: ActorMethod<[], Result_1>;
  depositFrom: ActorMethod<[bigint], Result_1>;
  deposit_test: ActorMethod<[bigint], Result_1>;
  findAllUserInfo: ActorMethod<[bigint, bigint], Result_9>;
  findRewardRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_8>;
  findStakingRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_8>;
  getAdmins: ActorMethod<[], Result_7>;
  getAllLocks: ActorMethod<[], Result_6>;
  getCycleInfo: ActorMethod<[], Result_5>;
  getErrorLog: ActorMethod<[], Array<string>>;
  getPoolInfo: ActorMethod<[], Result_3>;
  getUserInfo: ActorMethod<[Principal], Result_4>;
  getVersion: ActorMethod<[], string>;
  harvest: ActorMethod<[], Result>;
  pendingReward: ActorMethod<[Principal], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setAutoUnlockTimes: ActorMethod<[bigint], Result>;
  setTime: ActorMethod<[bigint, bigint], Result_3>;
  startTimer: ActorMethod<[], Result_3>;
  stop: ActorMethod<[], Result_3>;
  subaccountBalanceOf: ActorMethod<[Principal], Result>;
  updateTokenPool: ActorMethod<[UpdateTokenPool], Result_2>;
  withdraw: ActorMethod<[bigint], Result_1>;
  withdrawRemainingRewardToken: ActorMethod<[bigint, Principal], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
