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
export type Result =
  | {
      ok: {
        farmIndexCid: Principal;
        governanceCid: [] | [Principal];
        feeReceiverCid: Principal;
      };
    }
  | { err: Error };
export type Result_1 = { ok: bigint } | { err: Error };
export type Result_2 = { ok: CycleInfo } | { err: Error };
export type Result_3 = { ok: Array<Principal> } | { err: Error };
export type Result_4 = { ok: string } | { err: string };
export interface Token {
  address: string;
  standard: string;
}
export interface _SERVICE {
  addFarmControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  create: ActorMethod<[CreateFarmArgs], Result_4>;
  getAdmins: ActorMethod<[], Result_3>;
  getAllFarms: ActorMethod<[], Result_3>;
  getCycleInfo: ActorMethod<[], Result_2>;
  getFee: ActorMethod<[], Result_1>;
  getInitArgs: ActorMethod<[], Result>;
  getVersion: ActorMethod<[], string>;
  removeFarmControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setFarmAdmins: ActorMethod<[Principal, Array<Principal>], undefined>;
  setFee: ActorMethod<[bigint], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
