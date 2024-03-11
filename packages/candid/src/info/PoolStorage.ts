import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface PublicPoolChartDayData {
  'id' : bigint,
  'volumeUSD' : number,
  'timestamp' : bigint,
  'txCount' : bigint,
}
export interface PublicPoolOverView {
  'id' : bigint,
  'volumeUSD1d' : number,
  'volumeUSD7d' : number,
  'token0Id' : string,
  'token1Id' : string,
  'totalVolumeUSD' : number,
  'sqrtPrice' : number,
  'pool' : string,
  'tick' : bigint,
  'liquidity' : bigint,
  'token1Price' : number,
  'feeTier' : bigint,
  'volumeUSD' : number,
  'feesUSD' : number,
  'token1Standard' : string,
  'txCount' : bigint,
  'token1Decimals' : number,
  'token0Standard' : string,
  'token0Symbol' : string,
  'token0Decimals' : number,
  'token0Price' : number,
  'token1Symbol' : string,
}
export interface Transaction {
  'to' : string,
  'action' : TransactionType,
  'token0Id' : string,
  'token1Id' : string,
  'liquidityTotal' : bigint,
  'from' : string,
  'hash' : string,
  'tick' : bigint,
  'token1Price' : number,
  'recipient' : string,
  'token0ChangeAmount' : number,
  'sender' : string,
  'liquidityChange' : bigint,
  'token1Standard' : string,
  'token0Fee' : number,
  'token1Fee' : number,
  'timestamp' : bigint,
  'token1ChangeAmount' : number,
  'token1Decimals' : number,
  'token0Standard' : string,
  'amountUSD' : number,
  'amountToken0' : number,
  'amountToken1' : number,
  'poolFee' : bigint,
  'token0Symbol' : string,
  'token0Decimals' : number,
  'token0Price' : number,
  'token1Symbol' : string,
  'poolId' : string,
}
export type TransactionType = { 'decreaseLiquidity' : null } |
  { 'claim' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'increaseLiquidity' : null };
export interface _SERVICE {
  'addOwners' : ActorMethod<[Array<Principal>], undefined>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAllPools' : ActorMethod<[], Array<PublicPoolOverView>>,
  'getOwners' : ActorMethod<[], Array<Principal>>,
  'getPool' : ActorMethod<[string], PublicPoolOverView>,
  'getPoolChartData' : ActorMethod<
    [string, bigint, bigint],
    Array<PublicPoolChartDayData>
  >,
  'getPoolTransactions' : ActorMethod<
    [string, bigint, bigint],
    Array<Transaction>
  >,
  'insert' : ActorMethod<[Transaction], undefined>,
}