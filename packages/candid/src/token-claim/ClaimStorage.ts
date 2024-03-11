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
  'content' : Array<ClaimRecordInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<ClaimEventInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type ResponseResult = { 'ok' : ClaimEventInfo } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : [User, string] } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : Page_1 } |
  { 'err' : string };
export type User = { 'principal' : Principal } |
  { 'address' : string };
export type User__1 = { 'principal' : Principal } |
  { 'address' : string };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], BoolResult>,
  'addEvent' : ActorMethod<[ClaimEventInfo], BoolResult>,
  'addEventRecords' : ActorMethod<[string, Array<ClaimRecordInfo>], BoolResult>,
  'claim' : ActorMethod<[string, Principal], ResponseResult>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'deleteEvent' : ActorMethod<[string], BoolResult>,
  'findAllEventRecords' : ActorMethod<
    [[] | [bigint], bigint, bigint],
    ResponseResult_3
  >,
  'findAllEvents' : ActorMethod<
    [[] | [bigint], bigint, bigint],
    ResponseResult_4
  >,
  'findEventRecords' : ActorMethod<
    [string, [] | [bigint], bigint, bigint],
    ResponseResult_3
  >,
  'findUserEventRecords' : ActorMethod<
    [User, [] | [string], [] | [bigint], bigint, bigint],
    ResponseResult_3
  >,
  'getAdminList' : ActorMethod<[], ResponseResult_2>,
  'getCanisterPrincipal' : ActorMethod<[], ResponseResult_1>,
  'getEvent' : ActorMethod<[string], ResponseResult>,
  'ready' : ActorMethod<[string], BoolResult>,
  'removeAdmin' : ActorMethod<[string], BoolResult>,
  'setStatus' : ActorMethod<[string, boolean], BoolResult>,
  'userClaim' : ActorMethod<[string], ResponseResult>,
}
