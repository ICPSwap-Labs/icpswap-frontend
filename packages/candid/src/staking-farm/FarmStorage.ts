import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export interface DistributeRecord {
  'rewardToken' : Token,
  'rewardTotal' : bigint,
  'owner' : Principal,
  'farmCid' : string,
  'positionId' : bigint,
  'nftId' : bigint,
  'timestamp' : bigint,
  'rewardGained' : bigint,
  'poolCid' : string,
}
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export interface FarmStorage {
  'getCycleInfo' : ActorMethod<[], Result_2>,
  'getDistributeRecord' : ActorMethod<[bigint, bigint, string], Result_1>,
  'getStakeRecord' : ActorMethod<[bigint, bigint, string], Result>,
  'save' : ActorMethod<[Record], undefined>,
  'setFarmCanister' : ActorMethod<[Principal], undefined>,
}
export interface Page {
  'content' : Array<StakeRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<DistributeRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Record {
  'to' : Principal,
  'rewardToken' : Token,
  'rewardTotal' : bigint,
  'owner' : Principal,
  'transType' : TransType,
  'from' : Principal,
  'farmCid' : string,
  'liquidity' : bigint,
  'positionId' : bigint,
  'nftId' : bigint,
  'timestamp' : bigint,
  'rewardGained' : bigint,
  'poolCid' : string,
  'amount' : bigint,
}
export type Result = { 'ok' : Page } |
  { 'err' : string };
export type Result_1 = { 'ok' : Page_1 } |
  { 'err' : string };
export type Result_2 = { 'ok' : CycleInfo } |
  { 'err' : Error };
export interface StakeRecord {
  'to' : Principal,
  'rewardToken' : Token,
  'transType' : TransType,
  'from' : Principal,
  'farmCid' : string,
  'liquidity' : bigint,
  'positionId' : bigint,
  'nftId' : bigint,
  'timestamp' : bigint,
  'poolCid' : string,
  'amount' : bigint,
}
export interface Token { 'address' : string, 'standard' : string }
export type TransType = { 'claim' : null } |
  { 'distribute' : null } |
  { 'unstake' : null } |
  { 'stake' : null };
export interface _SERVICE extends FarmStorage {}
