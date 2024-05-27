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
      ok: { governanceCid: [] | [Principal]; feeReceiverCid: Principal };
    }
  | { err: Error };
export type Result_1 = { ok: bigint } | { err: Error };
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
  create: ActorMethod<[CreateFarmArgs], Result_6>;
  getAdmins: ActorMethod<[], Result_5>;
  getAllFarmId: ActorMethod<[], Result_5>;
  getAllFarms: ActorMethod<[], Result_4>;
  getCycleInfo: ActorMethod<[], Result_3>;
  getFarms: ActorMethod<[[] | [FarmStatus]], Result_2>;
  getFee: ActorMethod<[], Result_1>;
  getInitArgs: ActorMethod<[], Result>;
  getVersion: ActorMethod<[], string>;
  removeFarmControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setFarmAdmins: ActorMethod<[Principal, Array<Principal>], undefined>;
  setFee: ActorMethod<[bigint], undefined>;
  updateFarmInfo: ActorMethod<[FarmStatus, TVL], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
