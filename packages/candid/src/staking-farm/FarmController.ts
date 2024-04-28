import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface CreateFarmArgs {
  startTime: bigint;
  secondPerCycle: bigint;
  rewardToken: Token;
  endTime: bigint;
  rewardAmount: bigint;
  pool: Principal;
  refunder: Principal;
  priceInsideLimit: boolean;
  token0AmountLimit: bigint;
  rewardPool: Principal;
  token1AmountLimit: bigint;
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
export type FarmStatus = { LIVE: null } | { NOT_STARTED: null } | { CLOSED: null } | { FINISHED: null };
export type Result =
  | {
      ok: { ICP: Token; governanceCid: [] | [Principal] };
    }
  | { err: Error };
export type Result_1 = { ok: TVL } | { err: Error };
export type Result_2 = { ok: Array<[Principal, TVL]> } | { err: string };
export type Result_3 = { ok: CycleInfo } | { err: Error };
export type Result_4 =
  | {
      ok: {
        LIVE: Array<[Principal, TVL]>;
        NOT_STARTED: Array<[Principal, TVL]>;
        CLOSED: Array<[Principal, TVL]>;
        FINISHED: Array<[Principal, TVL]>;
      };
    }
  | { err: string };
export type Result_5 = { ok: Array<Principal> } | { err: Error };
export type Result_6 = { ok: string } | { err: string };
export interface TVL {
  stakedTokenTVL: number;
  rewardTokenTVL: number;
}
export interface Token {
  address: string;
  standard: string;
}
export interface _SERVICE {
  create: ActorMethod<[CreateFarmArgs], Result_6>;
  getAdmins: ActorMethod<[], Result_5>;
  getAllFarms: ActorMethod<[], Result_4>;
  getCycleInfo: ActorMethod<[], Result_3>;
  getFarms: ActorMethod<[[] | [FarmStatus]], Result_2>;
  getGlobalTVL: ActorMethod<[], Result_1>;
  getInitArgs: ActorMethod<[], Result>;
  getVersion: ActorMethod<[], string>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  updateFarmInfo: ActorMethod<[FarmStatus, FarmStatus, TVL], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
