import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export interface FarmController {
  'addController' : ActorMethod<[Principal], undefined>,
  'addControllersToFarm' : ActorMethod<[Principal], undefined>,
  'clearErrorLog' : ActorMethod<[], undefined>,
  'clearunusedCanister' : ActorMethod<[], undefined>,
  'create' : ActorMethod<
    [
      Token,
      bigint,
      string,
      string,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      boolean,
    ],
    Result_4
  >,
  'getControllerList' : ActorMethod<[], Result_3>,
  'getCycleInfo' : ActorMethod<[], Result_2>,
  'getErrorLog' : ActorMethod<[], Array<string>>,
  'getFarmList' : ActorMethod<[bigint, bigint, string], Result_1>,
  'getGlobalTVL' : ActorMethod<[], Result>,
  'getUnusedCanister' : ActorMethod<[], Array<string>>,
  'setControllerList' : ActorMethod<[Array<Principal>], undefined>,
}
export interface FarmInfo {
  'startTime' : bigint,
  'status' : string,
  'rewardTokenSymbol' : string,
  'creator' : Principal,
  'numberOfStakes' : bigint,
  'rewardToken' : Token,
  'endTime' : bigint,
  'totalRewardBalance' : bigint,
  'farmCid' : string,
  'pool' : string,
  'refunder' : Principal,
  'totalRewardClaimed' : bigint,
  'rewardTokenFee' : bigint,
  'poolToken0' : Token,
  'poolToken1' : Token,
  'poolFee' : bigint,
  'totalReward' : bigint,
  'rewardTokenDecimals' : bigint,
  'userNumberOfStakes' : bigint,
  'totalRewardUnclaimed' : bigint,
  'positionIds' : Array<bigint>,
}
export interface Page {
  'content' : Array<FarmInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type Result = {
    'ok' : { 'stakedTokenTVL' : number, 'rewardTokenTVL' : number }
  } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Page } |
  { 'err' : string };
export type Result_2 = { 'ok' : CycleInfo } |
  { 'err' : Error };
export type Result_3 = { 'ok' : Array<Principal> } |
  { 'err' : Error };
export type Result_4 = { 'ok' : string } |
  { 'err' : string };
export interface Token { 'address' : string, 'standard' : string }
export interface _SERVICE extends FarmController {}
