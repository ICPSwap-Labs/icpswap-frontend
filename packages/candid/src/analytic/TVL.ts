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
export type TransactionType = { 'decreaseLiquidity' : null } |
  { 'claim' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'increaseLiquidity' : null };
export interface TransactionsType {
  'to' : string,
  'action' : TransactionType,
  'token0Id' : string,
  'token1Id' : string,
  'liquidityTotal' : bigint,
  'from' : string,
  'exchangePrice' : number,
  'hash' : string,
  'tick' : bigint,
  'token1Price' : number,
  'recipient' : string,
  'token0ChangeAmount' : number,
  'sender' : string,
  'exchangeRate' : number,
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
export interface TvlChartDayData {
  'id' : bigint,
  'tvlUSD' : number,
  'timestamp' : bigint,
}
export interface TvlOverview { 'tvlUSD' : number, 'tvlUSDChange' : number }
export interface _SERVICE {
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAllPoolTvl' : ActorMethod<[], Array<[string, number]>>,
  'getAllTokenTvl' : ActorMethod<[], Array<[string, number]>>,
  'getPoolChartTvl' : ActorMethod<
    [string, bigint, bigint],
    Array<TvlChartDayData>
  >,
  'getPoolLastTvl' : ActorMethod<[string], TvlOverview>,
  'getPools' : ActorMethod<[], Array<[string, PoolInfo]>>,
  'getSyncError' : ActorMethod<[], string>,
  'getTokenChartTvl' : ActorMethod<
    [string, bigint, bigint],
    Array<TvlChartDayData>
  >,
  'getTokenLastTvl' : ActorMethod<[string], TvlOverview>,
  'saveTransactions' : ActorMethod<[TransactionsType], undefined>,
}