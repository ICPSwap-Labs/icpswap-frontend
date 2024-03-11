import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Config {
  'id' : string,
  'value' : Value,
  'appName' : [] | [string],
  'version' : number,
  'group' : string,
  'category' : [] | [string],
  'namespace' : string,
}
export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export interface Page {
  'content' : Array<Ticket>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type Result = { 'ok' : CycleInfo } |
  { 'err' : Error };
export interface Ticket {
  'subject' : string,
  'user' : Principal,
  'message' : string,
  'canister' : Principal,
  'timestamp' : bigint,
  'category' : string,
}
export type Value = { 'Map' : Array<[string, Value]> } |
  { 'List' : Array<Value> } |
  { 'Text' : string };
export interface _SERVICE {
  'addTicket' : ActorMethod<[Principal, string, string, string], bigint>,
  'get' : ActorMethod<[bigint], [] | [Ticket]>,
  'getCycleInfo' : ActorMethod<[], Result>,
  'onMessage' : ActorMethod<[Array<Config>], undefined>,
  'register' : ActorMethod<[], undefined>,
  'remove' : ActorMethod<[bigint], boolean>,
  'tickets' : ActorMethod<[[] | [bigint], [] | [bigint]], Page>,
}
