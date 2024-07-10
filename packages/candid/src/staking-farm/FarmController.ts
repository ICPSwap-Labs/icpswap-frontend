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
      ok: { farmAmount: bigint; principalAmount: bigint };
    }
  | { err: Error };
export type Result_1 = { ok: Array<Principal> } | { err: Error };
export type Result_2 =
  | {
      ok: { governanceCid: [] | [Principal]; feeReceiverCid: Principal };
    }
  | { err: Error };
export type Result_3 = { ok: bigint } | { err: Error };
export type Result_4 = { ok: Array<[Principal, TVL]> } | { err: string };
export type Result_5 = { ok: CycleInfo } | { err: Error };
export type Result_6 =
  | {
      ok: {
        LIVE: Array<[Principal, TVL]>;
        NOT_STARTED: Array<[Principal, TVL]>;
        CLOSED: Array<[Principal, TVL]>;
        FINISHED: Array<[Principal, TVL]>;
      };
    }
  | { err: string };
export type Result_7 = { ok: string } | { err: string };
export interface TVL {
  rewardToken: TokenAmount;
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
  addFarmControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  create: ActorMethod<[CreateFarmArgs], Result_7>;
  getAdmins: ActorMethod<[], Result_1>;
  getAllFarmId: ActorMethod<[], Result_1>;
  getAllFarms: ActorMethod<[], Result_6>;
  getCycleInfo: ActorMethod<[], Result_5>;
  getFarms: ActorMethod<[[] | [FarmStatus]], Result_4>;
  getFee: ActorMethod<[], Result_3>;
  getInitArgs: ActorMethod<[], Result_2>;
  getPrincipalRecord: ActorMethod<[], Result_1>;
  getTotalAmount: ActorMethod<[], Result>;
  getVersion: ActorMethod<[], string>;
  removeFarmControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setFarmAdmins: ActorMethod<[Principal, Array<Principal>], undefined>;
  setFee: ActorMethod<[bigint], undefined>;
  updateFarmInfo: ActorMethod<[FarmStatus, TVL], undefined>;
  updatePrincipalRecord: ActorMethod<[Array<Principal>], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
