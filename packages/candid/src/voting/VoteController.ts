import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface Page {
  'content' : Array<ProjectInfo>,
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
export type ResponseResult = { 'ok' : ProjectInfo } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : Page } |
  { 'err' : string };
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export type User = { 'principal' : Principal } |
  { 'address' : string };
export interface _SERVICE {
  'add' : ActorMethod<[ProjectInfo], BoolResult>,
  'addAdmin' : ActorMethod<[string], BoolResult>,
  'create' : ActorMethod<[ProjectInfo], BoolResult>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'delete' : ActorMethod<[string], BoolResult>,
  'findProjectPage' : ActorMethod<[bigint, bigint], ResponseResult_2>,
  'getAdminList' : ActorMethod<[], ResponseResult_1>,
  'getFileCanister' : ActorMethod<[], TextResult>,
  'getProject' : ActorMethod<[string], ResponseResult>,
  'removeAdmin' : ActorMethod<[string], BoolResult>,
  'setFileCanister' : ActorMethod<[string], BoolResult>,
}
