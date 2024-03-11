import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type Block = Value;
export type BlockIndex = bigint;
export type Map = Array<[string, Value]>;
export interface Transaction {
  'burn' : [] | [
    {
      'from' : Account,
      'memo' : [] | [Uint8Array],
      'created_at_time' : [] | [bigint],
      'amount' : bigint,
    }
  ],
  'kind' : string,
  'mint' : [] | [
    {
      'to' : Account,
      'memo' : [] | [Uint8Array],
      'created_at_time' : [] | [bigint],
      'amount' : bigint,
    }
  ],
  'timestamp' : bigint,
  'transfer' : [] | [
    {
      'to' : Account,
      'from' : Account,
      'memo' : [] | [Uint8Array],
      'created_at_time' : [] | [bigint],
      'amount' : bigint,
    }
  ],
}
export type Value = { 'Int' : bigint } |
  { 'Map' : Map } |
  { 'Nat' : bigint } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<Value> };
export interface _SERVICE {
  'append_blocks' : ActorMethod<[Array<Uint8Array | number[]>], undefined>,
  'get_blocks' : ActorMethod<
    [{ 'start' : bigint, 'length' : bigint }],
    { 'blocks' : Array<Block> }
  >,
  'get_transaction' : ActorMethod<[bigint], [] | [Transaction]>,
  'get_transactions' : ActorMethod<
    [{ 'start' : bigint, 'length' : bigint }],
    { 'transactions' : Array<Transaction> }
  >,
  'remaining_capacity' : ActorMethod<[], bigint>,
}