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
export interface PoolData {
  fee: bigint;
  key: string;
  tickSpacing: bigint;
  token0: Token;
  token1: Token;
  canisterId: Principal;
}
export type Result = { ok: Array<PoolData> } | { err: Error };
export type Result_1 = { ok: PoolData } | { err: Error };
export type Result_2 = { ok: CycleInfo } | { err: Error };
export interface SwapFactory {
  createPool: ActorMethod<[CreatePoolArgs], Result_1>;
  deletePool: ActorMethod<[string], undefined>;
  getAccessControlState: ActorMethod<[], { owners: Array<Principal>; clients: Array<Principal> }>;
  getAvailabilityState: ActorMethod<[], { whiteList: Array<Principal>; available: boolean }>;
  getCycleInfo: ActorMethod<[], Result_2>;
  getPool: ActorMethod<[GetPoolArgs], Result_1>;
  getPools: ActorMethod<[], Result>;
  getRemovedPools: ActorMethod<[], Result>;
  removePool: ActorMethod<[GetPoolArgs], undefined>;
  setAvailable: ActorMethod<[boolean], undefined>;
  setClients: ActorMethod<[Array<Principal>], undefined>;
  setOwnerToPool: ActorMethod<[string, Array<Principal>], undefined>;
  setOwners: ActorMethod<[Array<Principal>], undefined>;
  setWhiteList: ActorMethod<[Array<Principal>], undefined>;
}
export interface Token {
  address: string;
  standard: string;
}
export interface _SERVICE extends SwapFactory {}
