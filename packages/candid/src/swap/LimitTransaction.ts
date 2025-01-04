import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface LimitOrder {
  to: string;
  token0Id: string;
  token1Id: string;
  token0InAmount: number;
  liquidityTotal: bigint;
  from: string;
  hash: string;
  tick: bigint;
  recipient: string;
  token0ChangeAmount: number;
  positionId: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: number;
  token1Fee: number;
  timestamp: bigint;
  token1ChangeAmount: number;
  token1Decimals: number;
  token0Standard: string;
  poolFee: bigint;
  token0Symbol: string;
  price: bigint;
  token0Decimals: number;
  token1Symbol: string;
  poolId: string;
  token1InAmount: number;
}
export type NatResult = { ok: bigint } | { err: string };
export interface QueryResult {
  total: bigint;
  records: Array<LimitOrder>;
  storages: Array<[bigint, Principal]>;
}
export interface _SERVICE {
  addOwner: ActorMethod<[Principal], undefined>;
  batchInsert: ActorMethod<[Array<LimitOrder>], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  get: ActorMethod<[string, bigint, bigint, bigint], QueryResult>;
  getControllers: ActorMethod<[], Array<Principal>>;
  getOwners: ActorMethod<[], Array<Principal>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
