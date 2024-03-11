import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export interface PositionIndex {
  'addPoolId' : ActorMethod<[string], Result>,
  'getControllers' : ActorMethod<[], Result_3>,
  'getCycleInfo' : ActorMethod<[], Result_2>,
  'getPools' : ActorMethod<[], Result_1>,
  'getUserPools' : ActorMethod<[string], Result_1>,
  'initUserPoolMap' : ActorMethod<[Array<[string, Array<string>]>], undefined>,
  'removePoolId' : ActorMethod<[string], Result>,
  'removePoolIdWithoutCheck' : ActorMethod<[string], Result>,
  'setOwners' : ActorMethod<[Array<Principal>], undefined>,
  'updatePoolIds' : ActorMethod<[], undefined>,
}
export type Result = { 'ok' : boolean } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Array<string> } |
  { 'err' : Error };
export type Result_2 = { 'ok' : CycleInfo } |
  { 'err' : Error };
export type Result_3 = { 'ok' : Array<Principal> } |
  { 'err' : Error };
export interface _SERVICE extends PositionIndex {}
