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
export interface InitRequests {
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
  rewardFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
  feeReceiverCid: Principal;
}
export interface LedgerAmountInfo {
  staking: number;
  harvest: number;
  unStaking: number;
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
export interface PublicStakingPoolInfo {
  stakingTokenSymbol: string;
  startTime: bigint;
  lastRewardTime: bigint;
  totalDeposit: bigint;
  rewardTokenSymbol: string;
  creator: Principal;
  stakingToken: Token;
  rewardToken: Token;
  rewardPerTime: bigint;
  createTime: bigint;
  stakingTokenFee: bigint;
  rewardFee: bigint;
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
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: bigint } | { err: string };
export type Result_2 = { ok: boolean } | { err: string };
export type Result_3 = { ok: PublicStakingPoolInfo } | { err: string };
export type Result_4 = { ok: PublicUserInfo } | { err: string };
export type Result_5 = { ok: LedgerAmountInfo } | { err: Error };
export type Result_6 = { ok: CycleInfo } | { err: Error };
export type Result_7 = { ok: Array<Principal> } | { err: Error };
export type Result_8 = { ok: Page } | { err: string };
export type Result_9 = { ok: Page_1 } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export type TransType = { unstake: null } | { stake: null } | { harvest: null };
export interface UpdateStakingPool {
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
  claim: ActorMethod<[], Result>;
  claimReward: ActorMethod<[Principal], Result_2>;
  clearErrorLog: ActorMethod<[], undefined>;
  findAllUserInfo: ActorMethod<[bigint, bigint], Result_9>;
  findRewardRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_8>;
  findStakingRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_8>;
  getAdmins: ActorMethod<[], Result_7>;
  getCycleInfo: ActorMethod<[], Result_6>;
  getErrorLog: ActorMethod<[], Array<string>>;
  getLedgerInfo: ActorMethod<[], Result_5>;
  getPoolInfo: ActorMethod<[], Result_3>;
  getUserInfo: ActorMethod<[Principal], Result_4>;
  getVersion: ActorMethod<[], string>;
  harvest: ActorMethod<[], Result_2>;
  pendingReward: ActorMethod<[Principal], Result_1>;
  refundSubaccountBalance: ActorMethod<[Principal], Result>;
  refundUserStaking: ActorMethod<[Principal], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setTime: ActorMethod<[bigint, bigint], Result_3>;
  stake: ActorMethod<[], Result>;
  stakeFrom: ActorMethod<[bigint], Result>;
  stop: ActorMethod<[], Result_3>;
  subaccountBalanceOf: ActorMethod<[Principal], Result_1>;
  unclaimdRewardFee: ActorMethod<[], Result_1>;
  unstake: ActorMethod<[bigint], Result>;
  updateStakingPool: ActorMethod<[UpdateStakingPool], Result_2>;
  withdrawRemainingRewardToken: ActorMethod<[bigint, Principal], Result_1>;
  withdrawRewardFee: ActorMethod<[], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
