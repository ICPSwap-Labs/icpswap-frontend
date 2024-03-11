import type { Principal } from '@dfinity/principal';
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<TradeStatResp>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type ResponseResult = { 'ok' : StatResponse } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : TradeStatResp } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Page } |
  { 'err' : string };
export interface StatResponse {
  'totalVolume' : bigint,
  'listSize' : bigint,
  'totalTurnover' : bigint,
  'avgPrice' : bigint,
  'maxPrice' : bigint,
  'minPrice' : bigint,
}
export interface TradeStatResp {
  'cid' : string,
  'totalVolume' : bigint,
  'listSize' : bigint,
  'name' : string,
  'totalTurnover' : bigint,
  'floorPrice' : bigint,
  'avgPrice' : bigint,
  'maxPrice' : bigint,
  'minPrice' : bigint,
  'transactionCount' : bigint,
}
export interface _SERVICE {
  'addAdmin' : (arg_0: string) => Promise<BoolResult>,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'findCanisterStat' : (arg_0: bigint, arg_1: bigint) => Promise<
      ResponseResult_3
    >,
  'findNameStat' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<
      ResponseResult_3
    >,
  'getAdminList' : () => Promise<ResponseResult_2>,
  'getCanisterStat' : (arg_0: string) => Promise<ResponseResult_1>,
  'getNameStat' : (arg_0: string) => Promise<ResponseResult_1>,
  'getStat' : () => Promise<ResponseResult>,
  'init' : () => Promise<NatResult>,
  'listStat' : (
      arg_0: string,
      arg_1: string,
      arg_2: bigint,
      arg_3: boolean,
    ) => Promise<BoolResult>,
  'removeAdmin' : (arg_0: string) => Promise<BoolResult>,
  'setCanisterId' : (
      arg_0: [] | [string],
      arg_1: [] | [string],
      arg_2: [] | [string],
    ) => Promise<BoolResult>,
  'tradeStat' : (
      arg_0: bigint,
      arg_1: bigint,
      arg_2: string,
      arg_3: string,
    ) => Promise<BoolResult>,
}
