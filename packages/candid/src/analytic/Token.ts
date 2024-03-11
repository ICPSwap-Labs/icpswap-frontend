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
  'token1Decimals' : number,
  'token0Symbol' : string,
  'token0Decimals' : number,
  'token0Price' : number,
  'token1Symbol' : string,
}
export interface PublicTokenChartDayData {
  'id' : bigint,
  'volumeUSD' : number,
  'tvlUSD' : number,
  'timestamp' : bigint,
  'txCount' : bigint,
}
export interface PublicTokenOverview {
  'id' : bigint,
  'totalVolumeUSD' : number,
  'name' : string,
  'priceUSDChangeWeek' : number,
  'volumeUSD' : number,
  'feesUSD' : number,
  'priceUSDChange' : number,
  'tvlUSD' : number,
  'address' : string,
  'volumeUSDWeek' : number,
  'txCount' : bigint,
  'priceUSD' : number,
  'volumeUSDChange' : number,
  'tvlUSDChange' : number,
  'standard' : string,
  'tvlToken' : number,
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
export interface _SERVICE {
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'deleteToken' : ActorMethod<[string], undefined>,
  'getAllToken' : ActorMethod<[[] | [bigint]], Array<PublicTokenOverview>>,
  'getBaseDataStructureCanister' : ActorMethod<[], string>,
  'getLastID' : ActorMethod<[bigint], Array<[string, bigint]>>,
  'getPoolsForToken' : ActorMethod<[string], Array<PoolInfo>>,
  'getRollIndex' : ActorMethod<[], bigint>,
  'getStartHeartBeatStatus' : ActorMethod<[], boolean>,
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
    Array<TransactionsType>
  >,
  'getTvlRecord' : ActorMethod<[bigint], Array<[string, Array<number>]>>,
  'reset' : ActorMethod<[], undefined>,
  'rollBackData' : ActorMethod<[Array<TransactionsType>], undefined>,
  'rollBackStatus' : ActorMethod<[boolean], undefined>,
  'saveTransactions' : ActorMethod<[TransactionsType, boolean], undefined>,
}
