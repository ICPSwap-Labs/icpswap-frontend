import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export interface KVPair { 'k' : string, 'v' : bigint }
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<Principal>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<UserVotePowersInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_2 {
  'content' : Array<UserVoteRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_3 {
  'content' : Array<ProposalInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface ProjectInfo {
  'tokenCid' : string,
  'logo' : string,
  'name' : string,
  'projectCid' : string,
  'managerAddress' : User,
  'tokenStand' : string,
}
export interface ProjectInfo__1 {
  'tokenCid' : string,
  'logo' : string,
  'name' : string,
  'projectCid' : string,
  'managerAddress' : User,
  'tokenStand' : string,
}
export interface ProposalCreateInfo {
  'title' : string,
  'content' : string,
  'endTime' : bigint,
  'createUser' : string,
  'beginTime' : bigint,
  'userAmount' : bigint,
  'options' : Array<KVPair>,
}
export interface ProposalInfo {
  'id' : string,
  'storageCanisterId' : string,
  'title' : string,
  'content' : string,
  'endTime' : bigint,
  'createTime' : bigint,
  'createUser' : string,
  'state' : bigint,
  'createAddress' : User,
  'beginTime' : bigint,
  'userAmount' : bigint,
  'options' : Array<KVPair>,
  'project' : ProjectInfo,
}
export type ResponseResult = { 'ok' : ProposalInfo } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : ProjectInfo__1 } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Page } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Page_1 } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : Page_2 } |
  { 'err' : string };
export type ResponseResult_5 = { 'ok' : Page_3 } |
  { 'err' : string };
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export type User = { 'principal' : Principal } |
  { 'address' : string };
export interface UserVotePowersInfo {
  'availablePowers' : bigint,
  'address' : User,
  'usedPowers' : bigint,
}
export interface UserVoteRecord {
  'voteTime' : bigint,
  'address' : User,
  'usedProof' : bigint,
  'options' : Array<KVPair>,
}
export interface VoteProjectCanister {
  'addAdmin' : ActorMethod<[Principal], BoolResult>,
  'create' : ActorMethod<[ProposalCreateInfo], TextResult>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'deleteAdmin' : ActorMethod<[Principal], BoolResult>,
  'deleteProposal' : ActorMethod<[string], BoolResult>,
  'findPage' : ActorMethod<
    [[] | [string], [] | [bigint], bigint, bigint],
    ResponseResult_5
  >,
  'findRecordPage' : ActorMethod<[string, bigint, bigint], ResponseResult_4>,
  'findVotePower' : ActorMethod<
    [[] | [string], [] | [string], bigint, bigint],
    ResponseResult_3
  >,
  'getAdminList' : ActorMethod<[bigint, bigint], ResponseResult_2>,
  'getProject' : ActorMethod<[], ResponseResult_1>,
  'getProposal' : ActorMethod<[string], ResponseResult>,
  'getVotePowerCount' : ActorMethod<[], bigint>,
  'isProjectAdmin' : ActorMethod<[Principal], boolean>,
  'setOwner' : ActorMethod<[Principal], BoolResult>,
  'setProject' : ActorMethod<[ProjectInfo__1, string], BoolResult>,
  'setState' : ActorMethod<[string, bigint], BoolResult>,
  'setVotePower' : ActorMethod<[string, Array<UserVotePowersInfo>], BoolResult>,
  'updateProposal' : ActorMethod<[ProposalInfo], BoolResult>,
  'vote' : ActorMethod<[string, string, bigint], BoolResult>,
}
export interface _SERVICE extends VoteProjectCanister {}
