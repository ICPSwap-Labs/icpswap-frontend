import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface CanisterInfo {
  'cid' : string,
  'creator' : AccountIdentifier,
  'linkMap' : Array<KVPair>,
  'ownerName' : string,
  'owner' : AccountIdentifier,
  'name' : string,
  'createTime' : bigint,
  'totalSupply' : bigint,
  'introduction' : string,
  'mintSupply' : bigint,
  'royalties' : bigint,
  'image' : string,
}
export interface CanisterRequest {
  'linkMap' : Array<KVPair>,
  'ownerName' : string,
  'name' : string,
  'introduction' : string,
  'royalties' : bigint,
  'image' : string,
}
export interface KVPair { 'k' : string, 'v' : string }
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<CanisterInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface PageResponse {
  'content' : Array<CanisterInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type ResponseResult = { 'ok' : [bigint, bigint, string, string] } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : PageResponse } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : [bigint, string, string, string] } |
  { 'err' : string };
export type ResponseResult_5 = { 'ok' : CanisterInfo } |
  { 'err' : string };
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'add' : (arg_0: string, arg_1: bigint) => Promise<NatResult>,
  'addAdmin' : (arg_0: string) => Promise<BoolResult>,
  'canisterInfo' : (arg_0: string) => Promise<ResponseResult_5>,
  'create' : (arg_0: CanisterRequest) => Promise<TextResult>,
  'cycleAvailable' : () => Promise<NatResult>,
  'cycleBalance' : () => Promise<NatResult>,
  'delete' : (arg_0: string) => Promise<BoolResult>,
  'deleteTradeStatCanister' : (arg_0: string) => Promise<BoolResult>,
  'feeInfo' : () => Promise<ResponseResult>,
  'findCanister' : (arg_0: bigint, arg_1: bigint) => Promise<ResponseResult_2>,
  'findCanisterConfig' : () => Promise<ResponseResult_4>,
  'findTop5Canister' : (arg_0: bigint, arg_1: bigint) => Promise<
      ResponseResult_3
    >,
  'findUserCanister' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<
      ResponseResult_2
    >,
  'getAdminList' : () => Promise<ResponseResult_1>,
  'initLogo' : () => Promise<BoolResult>,
  'insert' : (arg_0: CanisterInfo) => Promise<NatResult>,
  'removeAdmin' : (arg_0: string) => Promise<BoolResult>,
  'setCanisterConfig' : (
      arg_0: bigint,
      arg_1: [] | [string],
      arg_2: [] | [string],
      arg_3: [] | [string],
      arg_4: number,
    ) => Promise<BoolResult>,
  'setFeeInfo' : (
      arg_0: bigint,
      arg_1: bigint,
      arg_2: string,
      arg_3: string,
    ) => Promise<ResponseResult>,
  'setLogo' : (arg_0: string, arg_1: string) => Promise<BoolResult>,
}
