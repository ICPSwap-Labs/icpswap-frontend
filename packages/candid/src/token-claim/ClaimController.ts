import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface ClaimEventInfo {
  'claimEventCreator' : Principal,
  'tokenCid' : string,
  'tokenStandard' : string,
  'claimedTokenAmount' : bigint,
  'claimEventId' : string,
  'tokenDecimals' : number,
  'claimEventStatus' : bigint,
  'tokenSymbol' : string,
  'totalUserAmount' : bigint,
  'totalTokenAmount' : bigint,
  'claimedUserAmount' : bigint,
  'tokenName' : string,
  'claimCanisterId' : string,
  'claimEventName' : string,
}
export interface ClaimQuota { 'user' : User, 'quota' : bigint }
export interface ClaimRecordInfo {
  'claimAmount' : bigint,
  'tokenCid' : string,
  'tokenStandard' : string,
  'claimStatus' : bigint,
  'claimEventId' : string,
  'tokenDecimals' : number,
  'claimTime' : [] | [bigint],
  'claimUser' : User__1,
  'tokenSymbol' : string,
  'tokenName' : string,
  'claimEventName' : string,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<ClaimEventInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<ClaimRecordInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type ResponseResult = { 'ok' : ClaimEventInfo } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Page_1 } |
  { 'err' : string };
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export type User = { 'principal' : Principal } |
  { 'address' : string };
export type User__1 = { 'principal' : Principal } |
  { 'address' : string };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], BoolResult>,
  'claim' : ActorMethod<[string], BoolResult>,
  'create' : ActorMethod<[ClaimEventInfo], TextResult>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'delete' : ActorMethod<[string], BoolResult>,
  'findAllEvents' : ActorMethod<[bigint, bigint], ResponseResult_2>,
  'findCreateEvents' : ActorMethod<
    [Principal, bigint, bigint],
    ResponseResult_2
  >,
  'findEventRecords' : ActorMethod<
    [string, [] | [bigint], bigint, bigint],
    ResponseResult_3
  >,
  'findUserEventRecords' : ActorMethod<
    [Principal, [] | [string], [] | [bigint], bigint, bigint],
    ResponseResult_3
  >,
  'findUserEvents' : ActorMethod<[Principal, bigint, bigint], ResponseResult_2>,
  'getAdminList' : ActorMethod<[], ResponseResult_1>,
  'getControllerAddress' : ActorMethod<[], TextResult>,
  'getEvent' : ActorMethod<[string], ResponseResult>,
  'getStorageCanister' : ActorMethod<[], TextResult>,
  'importQuota' : ActorMethod<[string, Array<ClaimQuota>], BoolResult>,
  'ready' : ActorMethod<[string], BoolResult>,
  'removeAdmin' : ActorMethod<[string], BoolResult>,
  'setStatus' : ActorMethod<[string, boolean], BoolResult>,
  'setStorageCanister' : ActorMethod<[string], BoolResult>,
  'unlock' : ActorMethod<[Principal], BoolResult>,
  'updateEvent' : ActorMethod<[ClaimEventInfo], BoolResult>,
}
