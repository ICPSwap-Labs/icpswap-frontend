import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AddFarmIndexArgs {
  rewardToken: Token;
  farmCid: Principal;
  poolToken0: Token;
  poolToken1: Token;
  poolCid: Principal;
  totalReward: bigint;
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
export interface FarmRewardInfo {
  poolToken0TVL: {
    address: Principal;
    amount: bigint;
    standard: string;
  };
  poolToken1TVL: {
    address: Principal;
    amount: bigint;
    standard: string;
  };
  pool: Principal;
  initTime: bigint;
  totalReward: {
    address: Principal;
    amount: bigint;
    standard: string;
  };
}
export type FarmStatus = { LIVE: null } | { NOT_STARTED: null } | { CLOSED: null } | { FINISHED: null };
export type Result = { ok: Array<Principal> } | { err: Error };
export type Result_1 =
  | {
      ok: { farmAmount: bigint; principalAmount: bigint };
    }
  | { err: Error };
export type Result_2 = { ok: Array<FarmRewardInfo> } | { err: Error };
export type Result_3 = { ok: Array<[Principal, Principal]> } | { err: Error };
export type Result_4 = { ok: Array<Principal> } | { err: string };
export type Result_5 = { ok: Array<[Principal, FarmRewardInfo]> } | { err: Error };
export type Result_6 = { ok: FarmRewardInfo } | { err: Error };
export type Result_7 = { ok: CycleInfo } | { err: Error };
export type Result_8 = { ok: Array<[Principal, Array<Principal>]> } | { err: Error };
export type Result_9 =
  | {
      ok: {
        LIVE: Array<Principal>;
        NOT_STARTED: Array<Principal>;
        CLOSED: Array<Principal>;
        FINISHED: Array<Principal>;
      };
    }
  | { err: string };
export interface SearchCondition {
  status: [] | [Array<FarmStatus>];
  rewardToken: [] | [Principal];
  pool: [] | [Principal];
  user: [] | [Principal];
}
export interface TVL {
  poolToken0: TokenAmount;
  poolToken1: TokenAmount;
}
export interface Token {
  address: string;
  standard: string;
}
export interface TokenAmount {
  address: string;
  amount: bigint;
  standard: string;
}
export interface _SERVICE {
  addFarmIndex: ActorMethod<[AddFarmIndexArgs], undefined>;
  getAllFarmUsers: ActorMethod<[], Result_8>;
  getAllFarms: ActorMethod<[], Result_9>;
  getAllPoolFarms: ActorMethod<[], Result_8>;
  getAllRewardTokenFarms: ActorMethod<[], Result_8>;
  getAllUserFarms: ActorMethod<[], Result_8>;
  getCycleInfo: ActorMethod<[], Result_7>;
  getFarmRewardTokenInfo: ActorMethod<[Principal], Result_6>;
  getFarmRewardTokenInfos: ActorMethod<[[] | [FarmStatus]], Result_5>;
  getFarmUsers: ActorMethod<[Principal], Result>;
  getFarms: ActorMethod<[[] | [FarmStatus]], Result_4>;
  getFarmsByConditions: ActorMethod<[SearchCondition], Result>;
  getFarmsByPool: ActorMethod<[Principal], Result>;
  getFarmsByRewardToken: ActorMethod<[Principal], Result>;
  getLiveFarmsByPools: ActorMethod<[Array<Principal>], Result_3>;
  getPrincipalRecord: ActorMethod<[], Result>;
  getRewardInfoByStatus: ActorMethod<[FarmStatus], Result_2>;
  getTotalAmount: ActorMethod<[], Result_1>;
  getUserFarms: ActorMethod<[Principal], Result>;
  getVersion: ActorMethod<[], string>;
  syncHisData: ActorMethod<[Principal, bigint], string>;
  updateFarmStatus: ActorMethod<[FarmStatus], undefined>;
  updateFarmTVL: ActorMethod<[TVL], undefined>;
  updateUserInfo: ActorMethod<[Array<Principal>], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
