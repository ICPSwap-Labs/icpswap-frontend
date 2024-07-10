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
export type LiquidationStatus = { pending: null } | { liquidation: null } | { liquidated: null };
export interface Page {
  content: Array<[Principal, PublicUserInfo]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<Record>;
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
  totalUnstaked: number;
  rewardPerTime: bigint;
  totalHarvest: number;
  name: string;
  liquidationStatus: LiquidationStatus;
  createTime: bigint;
  stakingTokenFee: bigint;
  rewardFee: bigint;
  rewardDebt: bigint;
  rewardTokenFee: bigint;
  accPerShare: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  totalStaked: number;
  rewardTokenDecimals: bigint;
  feeReceiverCid: Principal;
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
export interface Record {
  to: Principal;
  stakingTokenSymbol: string;
  result: string;
  rewardTokenSymbol: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  transType: TransType;
  from: Principal;
  transTokenType: TransTokenType;
  errMsg: string;
  rewardStandard: string;
  timestamp: bigint;
  stakingTokenDecimals: bigint;
  amount: bigint;
  rewardTokenDecimals: bigint;
}
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: PublicStakingPoolInfo } | { err: string };
export type Result_2 = { ok: bigint } | { err: string };
export type Result_3 = { ok: boolean } | { err: string };
export type Result_4 = { ok: PublicUserInfo } | { err: string };
export type Result_5 = { ok: CycleInfo } | { err: Error };
export type Result_6 = { ok: Array<Principal> } | { err: Error };
export type Result_7 = { ok: Page } | { err: string };
export type Result_8 = { ok: Array<[bigint, Record]> } | { err: Error };
export type Result_9 = { ok: Page_1 } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export type TransTokenType = { stakeToken: null } | { rewardToken: null };
export type TransType =
  | { withdraw: null }
  | { liquidate: null }
  | { deposit: null }
  | { unstake: null }
  | { stake: null }
  | { harvest: null };
export interface UpdateStakingPool {
  startTime: bigint;
  rewardPerTime: bigint;
  bonusEndTime: bigint;
}
export interface _SERVICE {
  claim: ActorMethod<[], Result>;
  deposit: ActorMethod<[], Result>;
  depositFrom: ActorMethod<[bigint], Result>;
  findRewardRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_9>;
  findStakingRecordPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_9>;
  findTransferRecord: ActorMethod<[], Result_8>;
  findUserInfo: ActorMethod<[bigint, bigint], Result_7>;
  getAdmins: ActorMethod<[], Result_6>;
  getCycleInfo: ActorMethod<[], Result_5>;
  getPoolInfo: ActorMethod<[], Result_1>;
  getUserInfo: ActorMethod<[Principal], Result_4>;
  getVersion: ActorMethod<[], string>;
  harvest: ActorMethod<[], Result_2>;
  liquidation: ActorMethod<[], Result>;
  pendingReward: ActorMethod<[Principal], Result_2>;
  refundRewardToken: ActorMethod<[], Result>;
  refundUserToken: ActorMethod<[], Result>;
  removeTransferRecord: ActorMethod<[bigint, boolean], Result_3>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  stake: ActorMethod<[], Result_2>;
  stop: ActorMethod<[], Result_1>;
  unclaimdRewardFee: ActorMethod<[], Result_2>;
  unstake: ActorMethod<[bigint], Result_2>;
  updateStakingPool: ActorMethod<[UpdateStakingPool], Result_1>;
  withdraw: ActorMethod<[boolean, bigint], Result>;
  withdrawRewardFee: ActorMethod<[], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
