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
export interface GlobalDataInfo {
  rewardAmount: number;
  stakingAmount: number;
}
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
  content: Array<TokenPoolInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: TokenPoolInfo } | { err: string };
export type Result_1 = { ok: TokenGlobalDataInfo } | { err: string };
export type Result_2 = { ok: { governanceCid: [] | [Principal] } } | { err: Error };
export type Result_3 = { ok: GlobalDataInfo } | { err: string };
export type Result_4 = { ok: CycleInfo } | { err: Error };
export type Result_5 = { ok: Array<Principal> } | { err: Error };
export type Result_6 = { ok: Page } | { err: Page };
export type Result_7 = { ok: Array<TokenGlobalDataInfo> } | { err: string };
export type Result_8 = { ok: boolean } | { err: string };
export type Result_9 = { ok: Principal } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export interface TokenGlobalDataInfo {
  rewardAmount: number;
  stakingAmount: number;
  rewardTokenPrice: number;
  rewardTokenCanisterId: string;
  stakingTokenCanisterId: string;
  stakingTokenPrice: number;
  stakingTokenAmount: bigint;
  rewardTokenAmount: bigint;
}
export interface TokenPoolInfo {
  stakingTokenSymbol: string;
  startTime: bigint;
  rewardTokenSymbol: string;
  creator: Principal;
  stakingToken: Token;
  rewardToken: Token;
  name: string;
  createTime: bigint;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
  canisterId: Principal;
}
export interface _SERVICE {
  createTokenPool: ActorMethod<[InitRequest], Result_9>;
  deleteTokenPool: ActorMethod<[Principal], Result_8>;
  findPoolStatInfo: ActorMethod<[], Result_7>;
  findTokenPoolPage: ActorMethod<[[] | [bigint], bigint, bigint], Result_6>;
  getAdmins: ActorMethod<[], Result_5>;
  getCycleInfo: ActorMethod<[], Result_4>;
  getGlobalData: ActorMethod<[], Result_3>;
  getInitArgs: ActorMethod<[], Result_2>;
  getPoolStatInfo: ActorMethod<[Principal], Result_1>;
  getTokenPool: ActorMethod<[Principal], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  startTokenPool: ActorMethod<[Principal, bigint, bigint], Result>;
  stopTokenPool: ActorMethod<[Principal], Result>;
  task_end: ActorMethod<[], undefined>;
  task_start: ActorMethod<[], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
