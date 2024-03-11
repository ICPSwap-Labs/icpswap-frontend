import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface BuyRequest { 'nftCid' : string, 'tokenIndex' : TokenIndex__1 }
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface OrderInfo {
  'cid' : string,
  'nftCid' : string,
  'tokenIndex' : TokenIndex__1,
  'hash' : string,
  'link' : string,
  'name' : string,
  'time' : Time,
  'minter' : AccountIdentifier,
  'filePath' : string,
  'fileType' : string,
  'seller' : AccountIdentifier,
  'introduction' : string,
  'royalties' : bigint,
  'artistName' : string,
  'price' : bigint,
}
export interface Page {
  'content' : Array<TxInfoResponse>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<OrderInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type ResponseResult = { 'ok' : [boolean, bigint, bigint, bigint] } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : StatResponse } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : OrderInfo } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_5 = { 'ok' : Page_1 } |
  { 'err' : string };
export type ResponseResult_6 = { 'ok' : [string, string] } |
  { 'err' : string };
export interface RevokeRequest {
  'nftCid' : string,
  'tokenIndex' : TokenIndex__1,
}
export interface SaleRequest {
  'nftCid' : string,
  'tokenIndex' : TokenIndex__1,
  'price' : bigint,
}
export interface StatResponse {
  'totalVolume' : bigint,
  'listSize' : bigint,
  'totalTurnover' : bigint,
  'avgPrice' : bigint,
  'maxPrice' : bigint,
  'minPrice' : bigint,
}
export type Time = bigint;
export type TokenIndex = number;
export type TokenIndex__1 = number;
export interface TxInfoResponse {
  'cid' : string,
  'nftCid' : string,
  'txFee' : bigint,
  'tokenIndex' : TokenIndex__1,
  'hash' : string,
  'name' : string,
  'time' : Time,
  'minter' : AccountIdentifier,
  'settleAmountStatus' : string,
  'royaltiesFeeStatus' : string,
  'royaltiesFee' : bigint,
  'filePath' : string,
  'fileType' : string,
  'txFeeStatus' : string,
  'seller' : AccountIdentifier,
  'txStatus' : string,
  'settleAmount' : bigint,
  'buyer' : AccountIdentifier,
  'price' : bigint,
}
export interface _SERVICE {
  'addAdmin' : (arg_0: string) => Promise<BoolResult>,
  'buy' : (arg_0: BuyRequest) => Promise<BoolResult>,
  'cancel' : (arg_0: number, arg_1: string) => Promise<BoolResult>,
  'cancelOrder' : (arg_0: number) => Promise<BoolResult>,
  'checkPayment' : (arg_0: string) => Promise<BoolResult>,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'findCanisterId' : () => Promise<ResponseResult_6>,
  'findCanisterRecommend' : (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<ResponseResult_5>,
  'findOrderPage' : (
      arg_0: [] | [string],
      arg_1: [] | [string],
      arg_2: [] | [AccountIdentifier__1],
      arg_3: [] | [TokenIndex],
      arg_4: bigint,
      arg_5: bigint,
      arg_6: string,
      arg_7: boolean,
    ) => Promise<ResponseResult_5>,
  'findRecommend' : (arg_0: bigint, arg_1: bigint) => Promise<ResponseResult_5>,
  'findTokenOrderPage' : (
      arg_0: TokenIndex,
      arg_1: string,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: string,
      arg_5: boolean,
    ) => Promise<ResponseResult_5>,
  'findTokenTxPage' : (
      arg_0: TokenIndex,
      arg_1: string,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: string,
      arg_5: boolean,
    ) => Promise<ResponseResult_4>,
  'findTxPage' : (
      arg_0: [] | [string],
      arg_1: [] | [string],
      arg_2: [] | [TokenIndex],
      arg_3: bigint,
      arg_4: bigint,
      arg_5: string,
      arg_6: boolean,
    ) => Promise<ResponseResult_4>,
  'findUserTxPage' : (
      arg_0: AccountIdentifier__1,
      arg_1: [] | [string],
      arg_2: [] | [string],
      arg_3: bigint,
      arg_4: bigint,
      arg_5: string,
      arg_6: boolean,
    ) => Promise<ResponseResult_4>,
  'getAddress' : () => Promise<string>,
  'getAdminList' : () => Promise<ResponseResult_3>,
  'getOrder' : (arg_0: string, arg_1: TokenIndex) => Promise<ResponseResult_2>,
  'getStat' : () => Promise<ResponseResult_1>,
  'getTradeState' : () => Promise<ResponseResult>,
  'removeAdmin' : (arg_0: string) => Promise<BoolResult>,
  'removeList' : () => Promise<BoolResult>,
  'revoke' : (arg_0: RevokeRequest) => Promise<BoolResult>,
  'sale' : (arg_0: SaleRequest) => Promise<BoolResult>,
  'setCanisterId' : (
      arg_0: [] | [string],
      arg_1: [] | [string],
      arg_2: [] | [string],
    ) => Promise<BoolResult>,
  'setState' : (arg_0: string, arg_1: string, arg_2: string) => Promise<
      BoolResult
    >,
  'setTradeState' : (arg_0: boolean) => Promise<BoolResult>,
  'unlock' : (arg_0: string, arg_1: TokenIndex) => Promise<BoolResult>,
}
