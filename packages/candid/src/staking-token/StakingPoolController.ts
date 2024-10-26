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
  valueOfStaking: number;
  valueOfRewarded: number;
  totalStaker: bigint;
  valueOfRewardsInProgress: number;
  totalPools: bigint;
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
  content: Array<StakingPoolInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: bigint } | { err: string };
export type Result_1 = { ok: StakingPoolInfo } | { err: string };
export type Result_10 = { ok: Array<TokenGlobalDataInfo> } | { err: string };
export type Result_11 = { ok: Principal } | { err: string };
export type Result_2 = { ok: boolean } | { err: string };
export type Result_3 = { ok: TokenGlobalDataInfo } | { err: string };
export type Result_4 = { ok: [string, string, bigint, bigint, boolean] } | { err: string };
export type Result_5 =
  | {
      ok: {
        governanceCid: [] | [Principal];
        userIndexCid: Principal;
        feeReceiverCid: Principal;
      };
    }
  | { err: Error };
export type Result_6 = { ok: GlobalDataInfo } | { err: string };
export type Result_7 = { ok: CycleInfo } | { err: Error };
export type Result_8 = { ok: Array<Principal> } | { err: Error };
export type Result_9 = { ok: Page } | { err: Page };
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
export interface _SERVICE {
  addStakingPoolControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  createStakingPool: ActorMethod<[InitRequest], Result_11>;
  deleteStakingPool: ActorMethod<[Principal], Result_2>;
  findPoolStatInfo: ActorMethod<[], Result_10>;
  findStakingPoolPage: ActorMethod<[[] | [bigint], bigint, bigint], Result_9>;
  findStakingPoolPageV2: ActorMethod<[[] | [bigint], bigint, bigint, [] | [string], [] | [string]], Result_9>;
  getAdmins: ActorMethod<[], Result_8>;
  getCycleInfo: ActorMethod<[], Result_7>;
  getGlobalData: ActorMethod<[], Result_6>;
  getInitArgs: ActorMethod<[], Result_5>;
  getOperationInfo: ActorMethod<[], Result_4>;
  getPoolStatInfo: ActorMethod<[Principal], Result_3>;
  getStakingPool: ActorMethod<[Principal], Result_1>;
  getVersion: ActorMethod<[], string>;
  removeStakingPoolControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setRewardFee: ActorMethod<[bigint], Result_2>;
  setStakingPoolAdmins: ActorMethod<[Principal, Array<Principal>], undefined>;
  setStakingPoolTime: ActorMethod<[Principal, bigint, bigint], Result_1>;
  setUpdateGlobalDataState: ActorMethod<[boolean], Result_2>;
  setUserIndexCanister: ActorMethod<[Principal], Result_2>;
  stopStakingPool: ActorMethod<[Principal], Result_1>;
  stopTimer: ActorMethod<[], undefined>;
  unclaimdRewardFee: ActorMethod<[Principal], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
