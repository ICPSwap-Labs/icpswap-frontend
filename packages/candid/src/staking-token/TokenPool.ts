import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface ChangeTokenPoolInfo {
  stakingTokenSymbol: string;
  lastRewardTime: bigint;
  rewardTokenSymbol: string;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  rewardTokenFeeMultiplier: bigint;
  bonusEndTime: bigint;
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
  stakingTokenFeeMultiplier: bigint;
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
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
}
export interface Page_2 {
  content: Array<[string, PublicUserInfo]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PublicTokenPoolInfo {
  stakingTokenSymbol: string;
  lastRewardTime: bigint;
  totalDeposit: bigint;
  rewardTokenSymbol: string;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  stakingTokenFee: bigint;
  rewardDebt: bigint;
  storageCid: string;
  rewardTokenFee: bigint;
  accPerShare: bigint;
  stakingTokenDecimals: bigint;
  rewardTokenFeeMultiplier: bigint;
  bonusEndTime: bigint;
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
  allocPoint: bigint;
  stakingTokenFeeMultiplier: bigint;
}
export interface PublicUserInfo {
  pendingReward: bigint;
  rewardDebt: bigint;
  amount: bigint;
}
export type Result_1 = { ok: string } | { err: string };
export type Result_10 = { ok: bigint } | { err: string };
export type Result_11 = { ok: PublicTokenPoolInfo } | { err: string };
export type Result_12 = { ok: PublicUserInfo } | { err: string };
export type Result_13 = { ok: Array<[Principal, bigint]> } | { err: string };
export type Result_14 = { ok: Page_2 } | { err: string };
export type Result_2 = { ok: boolean } | { err: string };
export type Result_5 = { ok: CycleInfo } | { err: Error };
export type Result_6 = { ok: Array<string> } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export type User = { principal: Principal } | { address: string };
export interface _SERVICE {
  addAdmin: ActorMethod<[string], Result_2>;
  balanceTo: ActorMethod<[Principal], Result_10>;
  changePoolInfo: ActorMethod<[ChangeTokenPoolInfo], Result_2>;
  claim: ActorMethod<[], Result_1>;
  claimTo: ActorMethod<[], Result_1>;
  clearLocksMap: ActorMethod<[], Result_10>;
  deposit: ActorMethod<[], Result_1>;
  depositFrom: ActorMethod<[bigint], Result_1>;
  endTokenPoolStaking: ActorMethod<[], Result_10>;
  findAllUserInfo: ActorMethod<[bigint, bigint], Result_14>;
  getAdminList: ActorMethod<[], Result_6>;
  getAllLocks: ActorMethod<[], Result_13>;
  getCycleInfo: ActorMethod<[], Result_5>;
  getPoolInfo: ActorMethod<[], Result_11>;
  getUserInfo: ActorMethod<[User], Result_12>;
  harvest: ActorMethod<[], Result_10>;
  pendingReward: ActorMethod<[User], Result_10>;
  registerTask: ActorMethod<[], Result_2>;
  removeAdmin: ActorMethod<[string], Result_2>;
  resetReward: ActorMethod<[bigint, bigint], Result_11>;
  setAutoUnlockTimes: ActorMethod<[bigint], Result_10>;
  setTaskState: ActorMethod<[boolean], Result_2>;
  setTokenPoolController: ActorMethod<[string], Result_2>;
  stopReward: ActorMethod<[], Result_11>;
  task: ActorMethod<[string], undefined>;
  updateMultiplier: ActorMethod<[bigint], Result_11>;
  withdraw: ActorMethod<[bigint], Result_1>;
  withdrawTokenTo: ActorMethod<[string, string, bigint, Principal], Result_10>;
}
