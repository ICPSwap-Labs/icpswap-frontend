import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Address = string;
export type Address__1 = string;
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<TransactionsType>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface PublicProtocolData {
  'volumeUSD' : number,
  'feesUSD' : number,
  'feesUSDChange' : number,
  'tvlUSD' : number,
  'txCount' : bigint,
  'volumeUSDChange' : number,
  'tvlUSDChange' : number,
}
export interface PublicSwapChartDayData {
  'id' : bigint,
  'volumeUSD' : number,
  'feesUSD' : number,
  'tvlUSD' : number,
  'timestamp' : bigint,
  'txCount' : bigint,
}
export interface RecordPage {
  'content' : Array<TransactionsType>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface SwapRecordInfo {
  'to' : string,
  'feeAmount' : bigint,
  'action' : TransactionType,
  'feeAmountTotal' : bigint,
  'token0Id' : Address,
  'token1Id' : Address,
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
  'TVLToken0' : bigint,
  'TVLToken1' : bigint,
  'token0Fee' : bigint,
  'token1Fee' : bigint,
  'timestamp' : bigint,
  'token1ChangeAmount' : bigint,
  'token0Standard' : string,
  'price' : bigint,
  'poolId' : string,
}
export type TransactionType = { 'fee' : null } |
  { 'burn' : null } |
  { 'claim' : null } |
  { 'mint' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'removeLiquidity' : null } |
  { 'refreshIncome' : null } |
  { 'transfer' : null } |
  { 'collect' : null };
export interface TransactionsType {
  'to' : string,
  'action' : _TransactionType,
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
export type _TransactionType = { 'fee' : null } |
  { 'burn' : null } |
  { 'claim' : null } |
  { 'mint' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'removeLiquidity' : null } |
  { 'refreshIncome' : null } |
  { 'transfer' : null } |
  { 'collect' : null };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], boolean>,
  'backBaseData' : ActorMethod<[], undefined>,
  'clearCacheRecordBack' : ActorMethod<[], undefined>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'get' : ActorMethod<[Address__1, bigint, bigint], RecordPage>,
  'getAddressAndCountByCondition' : ActorMethod<
    [string, string, bigint, bigint, bigint],
    Array<{ 'count' : bigint, 'address' : string }>,
  >,
  'getAdminList' : ActorMethod<[], Array<string>>,
  'getAllTransactions' : ActorMethod<
    [string, string, bigint, [] | [TransactionType], bigint, bigint],
    Page,
  >,
  'getBaseRecord' : ActorMethod<[bigint, bigint], RecordPage>,
  'getCanister' : ActorMethod<[], Array<string>>,
  'getChartData' : ActorMethod<[bigint, bigint], Array<PublicSwapChartDayData>>,
  'getPoolLastPrice' : ActorMethod<[string], number>,
  'getPoolLastRate' : ActorMethod<[string], number>,
  'getProtocolData' : ActorMethod<[], PublicProtocolData>,
  'getSwapPositionManagerCanisterId' : ActorMethod<[], string>,
  'getSwapUserAddress' : ActorMethod<[], Array<string>>,
  'getSwapUserNum' : ActorMethod<[], bigint>,
  'getTotalValueLockedUSD' : ActorMethod<[], bigint>,
  'getTxCount' : ActorMethod<[], bigint>,
  'isAdmin' : ActorMethod<[string], boolean>,
  'push' : ActorMethod<[SwapRecordInfo], undefined>,
  'removeAdmin' : ActorMethod<[string], boolean>,
  'removePoolList' : ActorMethod<[string], undefined>,
  'removeTokenList' : ActorMethod<[string], undefined>,
  'rollBackBaseData' : ActorMethod<[], undefined>,
  'rollBackCache' : ActorMethod<[], undefined>,
  'rollBackDataBaseRecord' : ActorMethod<[bigint, bigint], undefined>,
  'rollBackData_Pools' : ActorMethod<[bigint, bigint], undefined>,
  'rollBackData_Token' : ActorMethod<[bigint, bigint], undefined>,
  'rollBackStatus' : ActorMethod<[boolean], undefined>,
  'rollBackSwapDayData' : ActorMethod<[], undefined>,
  'rollBackUserRecord' : ActorMethod<[], undefined>,
  'setCanister' : ActorMethod<[string, string], undefined>,
  'setSwapPositionManagerCanisterId' : ActorMethod<[string], undefined>,
  'sortBaseData' : ActorMethod<[], undefined>,
}
