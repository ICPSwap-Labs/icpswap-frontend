import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type NatResult = { ok: bigint } | { err: string };
export interface RecordPage {
  content: Array<Transaction>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Transaction {
  to: string;
  action: TransactionType;
  token0Id: string;
  token1Id: string;
  liquidityTotal: bigint;
  from: string;
  hash: string;
  tick: bigint;
  token1Price: number;
  recipient: string;
  token0ChangeAmount: number;
  sender: string;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: number;
  token1Fee: number;
  timestamp: bigint;
  token1ChangeAmount: number;
  token1Decimals: number;
  token0Standard: string;
  amountUSD: number;
  amountToken0: number;
  amountToken1: number;
  poolFee: bigint;
  token0Symbol: string;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
  poolId: string;
}
export type TransactionType =
  | { decreaseLiquidity: null }
  | { claim: null }
  | { swap: null }
  | { addLiquidity: null }
  | { increaseLiquidity: null };
export interface _SERVICE {
  addOwners: ActorMethod<[Array<Principal>], undefined>;
  batchInsert: ActorMethod<[Array<Transaction>], undefined>;
  clean: ActorMethod<[], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getBaseRecord: ActorMethod<[bigint, bigint, Array<string>], RecordPage>;
  getByPool: ActorMethod<[bigint, bigint, string], RecordPage>;
  getByToken: ActorMethod<[bigint, bigint, string], RecordPage>;
  getOwners: ActorMethod<[], Array<Principal>>;
  getTxCount: ActorMethod<[], bigint>;
  insert: ActorMethod<[Transaction], undefined>;
}
