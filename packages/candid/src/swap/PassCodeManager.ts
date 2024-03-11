import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface DepositArgs {
  fee: bigint;
  amount: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export type Result = { ok: bigint } | { err: Error };
export type Result_1 = { ok: string } | { err: Error };
export interface WithdrawArgs {
  fee: bigint;
  amount: bigint;
}
export interface _SERVICE {
  balanceOf: ActorMethod<[Principal], bigint>;
  deposit: ActorMethod<[DepositArgs], Result>;
  depositFrom: ActorMethod<[DepositArgs], Result>;
  destoryPasscode: ActorMethod<[Principal, Principal, bigint], Result_1>;
  getFactoryCid: ActorMethod<[], Principal>;
  getTokenCid: ActorMethod<[], Principal>;
  metadata: ActorMethod<
    [],
    {
      passcodePrice: bigint;
      tokenCid: Principal;
      factoryCid: Principal;
    }
  >;
  requestPasscode: ActorMethod<[Principal, Principal, bigint], Result_1>;
  withdraw: ActorMethod<[WithdrawArgs], Result>;
}
