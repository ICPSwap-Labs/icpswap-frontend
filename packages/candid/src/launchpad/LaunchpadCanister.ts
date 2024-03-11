import type { Principal } from '@dfinity/principal';
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface Investor {
  'id' : string,
  'finalTokenSet' : [] | [TokenSet],
  'principal' : Principal,
  'participatedDateTime' : Time,
  'expectedDepositedWICPQuantity' : string,
  'withdrawalDateTime' : [] | [Time],
  'expectedBuyTokenQuantity' : string,
}
export interface LaunchpadCanister {
  'addInvestor' : (arg_0: string) => Promise<BoolResult>,
  'addInvestorAddress' : (arg_0: string) => Promise<undefined>,
  'appendWICPQuantity' : (arg_0: string) => Promise<BoolResult>,
  'computeFinalTokenViewSet' : (arg_0: bigint, arg_1: bigint) => Promise<
      TokenViewSet
    >,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'getInvestorDetail' : (arg_0: string) => Promise<ResponseResult_2>,
  'getInvestors' : () => Promise<Array<Investor>>,
  'getInvestorsSize' : () => Promise<bigint>,
  'getWICPQuantity' : () => Promise<ResponseResult_1>,
  'install' : (arg_0: Property, arg_1: string, arg_2: Array<string>) => Promise<
      BoolResult
    >,
  'transferByAddress' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
      arg_3: string,
      arg_4: string,
    ) => Promise<boolean>,
  'uninstall' : () => Promise<BoolResult>,
  'withdraw2Investor' : () => Promise<ResponseResult>,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Property {
  'id' : string,
  'cid' : string,
  'receiveTokenDateTime' : Time,
  'creator' : string,
  'depositDateTime' : [] | [Time],
  'createdDateTime' : Time,
  'expectedFundraisingWICPQuantity' : string,
  'settled' : [] | [boolean],
  'name' : string,
  'extraTokenFee' : [] | [bigint],
  'description' : string,
  'soldQuantity' : string,
  'soldTokenId' : string,
  'withdrawalDateTime' : [] | [Time],
  'limitedAmountOnce' : string,
  'endDateTime' : Time,
  'creatorPrincipal' : Principal,
  'soldTokenStandard' : string,
  'fundraisingWICPQuantity' : [] | [string],
  'depositedQuantity' : string,
  'expectedSellQuantity' : string,
  'startDateTime' : Time,
  'initialExchangeRatio' : string,
}
export type ResponseResult = { 'ok' : TokenSet } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : bigint } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Investor } |
  { 'err' : string };
export type Time = bigint;
export interface TokenInfo {
  'logo' : string,
  'name' : string,
  'quantity' : string,
  'symbol' : string,
}
export interface TokenSet { 'token' : TokenInfo, 'wicp' : TokenInfo }
export interface TokenViewSet {
  'token' : { 'info' : TokenInfo, 'transFee' : bigint },
  'wicp' : { 'info' : TokenInfo, 'transFee' : bigint },
}
export interface _SERVICE extends LaunchpadCanister {}
