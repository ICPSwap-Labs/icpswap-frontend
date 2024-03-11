import type { Principal } from '@dfinity/principal';
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface CanisterView {
  'id' : string,
  'name' : string,
  'cycle' : bigint,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<Property>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
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
export type ResponseResult = { 'ok' : Property } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Array<CanisterView> } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : string } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addWhitelist' : (arg_0: Array<string>) => Promise<boolean>,
  'archive' : () => Promise<BoolResult>,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'deleteWhitelist' : (arg_0: Array<string>) => Promise<boolean>,
  'generate' : (arg_0: Property) => Promise<ResponseResult_3>,
  'getAllPools' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<
      ResponseResult_1
    >,
  'getCanisters' : () => Promise<ResponseResult_2>,
  'getPoolsByOwner' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<
      ResponseResult_1
    >,
  'getWhitelist' : () => Promise<Array<string>>,
  'install' : (arg_0: string, arg_1: Property, arg_2: Array<string>) => Promise<
      ResponseResult
    >,
  'result' : () => Promise<string>,
  'setController' : (arg_0: string, arg_1: string) => Promise<boolean>,
  'uninstall' : () => Promise<BoolResult>,
}
