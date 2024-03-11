import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface PoolInfo {
  'fee' : bigint,
  'token0Id' : string,
  'token1Id' : string,
  'pool' : string,
  'token1Price' : number,
  'token1Standard' : string,
  'token1Decimals' : number,
  'token0Standard' : string,
  'token0Symbol' : string,
  'token0Decimals' : number,
  'token0Price' : number,
  'token1Symbol' : string,
}
export interface PublicTokenChartDayData {
  'id' : bigint,
  'volumeUSD' : number,
  'timestamp' : bigint,
  'txCount' : bigint,
}
export interface PublicTokenOverview {
  'id' : bigint,
  'volumeUSD1d' : number,
  'volumeUSD7d' : number,
  'totalVolumeUSD' : number,
  'name' : string,
  'volumeUSD' : number,
  'feesUSD' : number,
  'priceUSDChange' : number,
  'address' : string,
  'txCount' : bigint,
  'priceUSD' : number,
  'standard' : string,
  'symbol' : string,
}
export interface PublicTokenPricesData {
  'id' : bigint,
  'low' : number,
  'high' : number,
  'close' : number,
  'open' : number,
  'timestamp' : bigint,
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
  'getAllTokens' : ActorMethod<[], Array<PublicTokenOverview>>,
  'getOwners' : ActorMethod<[], Array<Principal>>,
  'getPoolsForToken' : ActorMethod<[string], Array<PoolInfo>>,
  'getToken' : ActorMethod<[string], PublicTokenOverview>,
  'getTokenChartData' : ActorMethod<
    [string, bigint, bigint],
    Array<PublicTokenChartDayData>
  >,
  'getTokenPricesData' : ActorMethod<
    [string, bigint, bigint, bigint],
    Array<PublicTokenPricesData>
  >,
  'getTokenTransactions' : ActorMethod<
    [string, bigint, bigint],
    Array<Transaction>
  >,
  'insert' : ActorMethod<[string, Transaction], undefined>,
}