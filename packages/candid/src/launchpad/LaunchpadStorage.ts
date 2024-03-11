import type { Principal } from '@dfinity/principal';
export interface HistoryTransaction {
  'launchpadAddress' : string,
  'time' : Time,
  'operationType' : string,
  'tokenSymbol' : string,
  'address' : string,
  'quantity' : string,
  'tokenName' : string,
  'managerAddress' : string,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<Property>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<HistoryTransaction>,
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
export type ResponseResult = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Page_1 } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addSettledLaunchpad' : (arg_0: Property) => Promise<undefined>,
  'addTransaction' : (arg_0: string, arg_1: HistoryTransaction) => Promise<
      undefined
    >,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'getHistoryTransactionsByPage' : (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<ResponseResult_1>,
  'getSettledLaunchpadsByPage' : (arg_0: bigint, arg_1: bigint) => Promise<
      ResponseResult
    >,
}
