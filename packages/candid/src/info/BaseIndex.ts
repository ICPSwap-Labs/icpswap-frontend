import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface BaseIndex {
  'addOwner' : ActorMethod<[Principal], undefined>,
  'baseLastStorage' : ActorMethod<[], string>,
  'baseStorage' : ActorMethod<[], Array<string>>,
  'batchPush' : ActorMethod<[Array<SwapRecordInfo>], undefined>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAllowTokens' : ActorMethod<[], Array<string>>,
  'getEnableSync' : ActorMethod<[], boolean>,
  'getOwners' : ActorMethod<[], Array<Principal>>,
  'getPoolLastPrice' : ActorMethod<[string], number>,
  'getSyncError' : ActorMethod<[], string>,
  'getSyncLock' : ActorMethod<[], boolean>,
  'getSyncOffset' : ActorMethod<[], bigint>,
  'getSyncStatus' : ActorMethod<[], boolean>,
  'priceCanister' : ActorMethod<[], Array<string>>,
  'push' : ActorMethod<[SwapRecordInfo], undefined>,
  'setEnableSync' : ActorMethod<[boolean], boolean>,
  'setPriceCanister' : ActorMethod<[string], undefined>,
  'syncOldDataToLast' : ActorMethod<[bigint], boolean>,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface SwapRecordInfo {
  'to' : string,
  'feeAmount' : bigint,
  'action' : TransactionType,
  'feeAmountTotal' : bigint,
  'token0Id' : string,
  'token1Id' : string,
  'token0AmountTotal' : bigint,
  'liquidityTotal' : bigint,
  'from' : string,
  'tick' : bigint,
  'feeTire' : bigint,
  'recipient' : string,
  'token0ChangeAmount' : bigint,
  'token1AmountTotal' : bigint,
  'liquidityChange' : bigint,
  'token1Standard' : string,
  'token0Fee' : bigint,
  'token1Fee' : bigint,
  'timestamp' : bigint,
  'token1ChangeAmount' : bigint,
  'token0Standard' : string,
  'price' : bigint,
  'poolId' : string,
}
export type TransactionType = { 'decreaseLiquidity' : null } |
  { 'claim' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'increaseLiquidity' : null };
export interface _SERVICE extends BaseIndex {}
