import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface CreatePoolArgs {
  fee: bigint;
  sqrtPriceX96: string;
  token0: Token;
  token1: Token;
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
export interface GetPoolArgs {
  fee: bigint;
  token0: Token;
  token1: Token;
}
export interface Passcode {
  fee: bigint;
  token0: Principal;
  token1: Principal;
}
export interface PoolData {
  fee: bigint;
  key: string;
  tickSpacing: bigint;
  token0: Token;
  token1: Token;
  canisterId: Principal;
}
export type Result = { ok: string } | { err: Error };
export type Result_1 = { ok: null } | { err: Error };
export type Result_2 = { ok: Array<PoolData> } | { err: Error };
export type Result_3 =
  | { ok: Array<[Principal, Array<Passcode>]> }
  | { err: Error };
export type Result_4 = { ok: PoolData } | { err: Error };
export type Result_5 = { ok: Array<Passcode> } | { err: Error };
export type Result_6 = { ok: [] | [Principal] } | { err: Error };
export type Result_7 = { ok: CycleInfo } | { err: Error };
export interface Token {
  address: string;
  standard: string;
}
export interface _SERVICE {
  addPasscode: ActorMethod<[Principal, Passcode], Result_1>;
  addPoolControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  batchAddPoolControllers: ActorMethod<
    [Array<Principal>, Array<Principal>],
    undefined
  >;
  batchRemovePoolControllers: ActorMethod<
    [Array<Principal>, Array<Principal>],
    undefined
  >;
  batchSetPoolAdmins: ActorMethod<
    [Array<Principal>, Array<Principal>],
    undefined
  >;
  clearRemovedPool: ActorMethod<[Principal], string>;
  createPool: ActorMethod<[CreatePoolArgs], Result_4>;
  deletePasscode: ActorMethod<[Principal, Passcode], Result_1>;
  getCycleInfo: ActorMethod<[], Result_7>;
  getGovernanceCid: ActorMethod<[], Result_6>;
  getPasscodesByPrincipal: ActorMethod<[Principal], Result_5>;
  getPool: ActorMethod<[GetPoolArgs], Result_4>;
  getPools: ActorMethod<[], Result_2>;
  getPrincipalPasscodes: ActorMethod<[], Result_3>;
  getRemovedPools: ActorMethod<[], Result_2>;
  getVersion: ActorMethod<[], string>;
  removePool: ActorMethod<[GetPoolArgs], string>;
  removePoolControllers: ActorMethod<[Principal, Array<Principal>], undefined>;
  removePoolWithdrawErrorLog: ActorMethod<
    [Principal, bigint, boolean],
    Result_1
  >;
  restorePool: ActorMethod<[Principal], string>;
  setPoolAdmins: ActorMethod<[Principal, Array<Principal>], undefined>;
  upgradePoolTokenStandard: ActorMethod<[Principal, Principal], Result>;
}
