import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

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
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
}
export interface Page {
  content: Array<TokenPoolInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: TokenPoolInfo } | { err: string };
export type Result_1 = { ok: string } | { err: string };
export type Result_2 = { ok: boolean } | { err: string };
export type Result_3 = { ok: GlobalDataInfo } | { err: string };
export type Result_4 = { ok: TokenGlobalDataInfo } | { err: string };
export type Result_5 = { ok: CycleInfo } | { err: Error };
export type Result_6 = { ok: Array<string> } | { err: string };
export type Result_7 = { ok: Array<TokenGlobalDataInfo> } | { err: string };
export type Result_8 = { ok: Page } | { err: Page };
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
  creator: string;
  stakingToken: Token;
  rewardToken: Token;
  name: string;
  createTime: bigint;
  stakingTokenFee: bigint;
  version: string;
  storageCid: string;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  rewardTokenFeeMultiplier: bigint;
  bonusEndTime: bigint;
  rewardTokenDecimals: bigint;
  stakingTokenFeeMultiplier: bigint;
  canisterId: string;
}
export interface _SERVICE {
  addAdmin: ActorMethod<[string], Result_2>;
  createTokenPool: ActorMethod<[InitRequest], Result_1>;
  deleteTokenPool: ActorMethod<[Principal], Result_2>;
  findTokenPoolPage: ActorMethod<[[] | [bigint], bigint, bigint], Result_8>;
  findTokenPoolsGlobalData: ActorMethod<[], Result_7>;
  getAdminList: ActorMethod<[], Result_6>;
  getCanister: ActorMethod<[], { icp: Token; scheduleCanister: string }>;
  getCycleInfo: ActorMethod<[], Result_5>;
  getPoolInfo: ActorMethod<[Principal], Result>;
  getPoolStatInfo: ActorMethod<[Principal], Result_4>;
  getTokenPoolsGlobalData: ActorMethod<[], Result_3>;
  registerTask: ActorMethod<[], Result_2>;
  removeAdmin: ActorMethod<[string], Result_2>;
  setICP: ActorMethod<[Token], Result_2>;
  setScheduleCanister: ActorMethod<[string], Result_2>;
  setTaskState: ActorMethod<[boolean], Result_2>;
  setTokenPoolAdmin: ActorMethod<[Principal, string], Result_2>;
  startTokenPool: ActorMethod<[Principal, bigint, bigint], Result>;
  stopTokenPool: ActorMethod<[Principal], Result>;
  syncV1TokenPool: ActorMethod<[], Result_1>;
  syncV1TokenPoolInfo: ActorMethod<[], Result_1>;
  task: ActorMethod<[string], undefined>;
  updateMultiplier: ActorMethod<[Principal, bigint], Result>;
  updateStat: ActorMethod<[], boolean>;
}
