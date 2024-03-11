import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export interface Deposit {
  'tickUpper' : bigint,
  'rewardAmount' : bigint,
  'owner' : string,
  'pool' : string,
  'liquidity' : bigint,
  'initTime' : bigint,
  'positionId' : bigint,
  'token0Amount' : bigint,
  'holder' : string,
  'token1Amount' : bigint,
  'tickLower' : bigint,
}
export interface DistributeRecord {
  'rewardTotal' : bigint,
  'owner' : Principal,
  'positionId' : bigint,
  'timestamp' : bigint,
  'rewardGained' : bigint,
}
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export interface Farm {
  'clearErrorLog' : ActorMethod<[], undefined>,
  'close' : ActorMethod<[], Result>,
  'finishManually' : ActorMethod<[], Result>,
  'getConfigCids' : ActorMethod<[], Result_15>,
  'getControllers' : ActorMethod<[], Result_14>,
  'getCycleInfo' : ActorMethod<[], Result_13>,
  'getDeposit' : ActorMethod<[bigint], Result_12>,
  'getDistributeRecord' : ActorMethod<[bigint, bigint, string], Result_11>,
  'getErrorLog' : ActorMethod<[], Array<string>>,
  'getFarmInfo' : ActorMethod<[string], Result_10>,
  'getLimitInfo' : ActorMethod<[], Result_9>,
  'getLiquidityInfo' : ActorMethod<[], Result_8>,
  'getPositionIds' : ActorMethod<[], Result_7>,
  'getRewardInfo' : ActorMethod<[Array<bigint>], Result_6>,
  'getRewardMeta' : ActorMethod<[], Result_5>,
  'getStakeRecord' : ActorMethod<[bigint, bigint, string], Result_4>,
  'getTVL' : ActorMethod<[], Result_3>,
  'getTokenBalance' : ActorMethod<[], bigint>,
  'getUserPositions' : ActorMethod<[Principal, bigint, bigint], Result_2>,
  'getUserTVL' : ActorMethod<[Principal], Result_1>,
  'init' : ActorMethod<[InitFarm], FarmInfo>,
  'resetRewardMeta' : ActorMethod<[], undefined>,
  'setControllers' : ActorMethod<[Array<Principal>], undefined>,
  'setLimitInfo' : ActorMethod<[bigint, bigint, bigint, boolean], undefined>,
  'stake' : ActorMethod<[bigint], Result>,
  'unstake' : ActorMethod<[bigint], Result>,
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
export interface InitFarm {
  'ICP' : Token,
  'startTime' : bigint,
  'status' : string,
  'secondPerCycle' : bigint,
  'creator' : Principal,
  'rewardToken' : Token,
  'controllerList' : Array<Principal>,
  'endTime' : bigint,
  'pool' : string,
  'refunder' : Principal,
  'priceInsideLimit' : boolean,
  'token0AmountLimit' : bigint,
  'token1AmountLimit' : bigint,
  'totalReward' : bigint,
}
export interface Page {
  'content' : Array<Deposit>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<StakeRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_2 {
  'content' : Array<DistributeRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type Result = { 'ok' : string } |
  { 'err' : Error };
export type Result_1 = { 'ok' : number } |
  { 'err' : Error };
export type Result_10 = { 'ok' : FarmInfo } |
  { 'err' : Error };
export type Result_11 = { 'ok' : Page_2 } |
  { 'err' : string };
export type Result_12 = { 'ok' : Deposit } |
  { 'err' : Error };
export type Result_13 = { 'ok' : CycleInfo } |
  { 'err' : Error };
export type Result_14 = { 'ok' : Array<Principal> } |
  { 'err' : Error };
export type Result_15 = {
    'ok' : { 'rewardPoolCid' : string, 'poolCid' : string }
  } |
  { 'err' : Error };
export type Result_2 = { 'ok' : Page } |
  { 'err' : Error };
export type Result_3 = {
    'ok' : { 'stakedTokenTVL' : number, 'rewardTokenTVL' : number }
  } |
  { 'err' : Error };
export type Result_4 = { 'ok' : Page_1 } |
  { 'err' : string };
export type Result_5 = {
    'ok' : {
      'secondPerCycle' : bigint,
      'totalRewardBalance' : bigint,
      'rewardPerCycle' : bigint,
      'totalRewardClaimed' : bigint,
      'totalCycleCount' : bigint,
      'currentCycleCount' : bigint,
      'totalReward' : bigint,
      'totalRewardUnclaimed' : bigint,
    }
  } |
  { 'err' : Error };
export type Result_6 = { 'ok' : bigint } |
  { 'err' : Error };
export type Result_7 = { 'ok' : Array<bigint> } |
  { 'err' : Error };
export type Result_8 = {
    'ok' : {
      'poolToken0Amount' : bigint,
      'totalLiquidity' : bigint,
      'poolToken1Amount' : bigint,
    }
  } |
  { 'err' : Error };
export type Result_9 = {
    'ok' : {
      'priceInsideLimit' : boolean,
      'positionNumLimit' : bigint,
      'token0AmountLimit' : bigint,
      'token1AmountLimit' : bigint,
    }
  } |
  { 'err' : Error };
export interface StakeRecord {
  'to' : Principal,
  'transType' : TransType,
  'from' : Principal,
  'liquidity' : bigint,
  'positionId' : bigint,
  'timestamp' : bigint,
  'amount' : bigint,
}
export interface Token { 'address' : string, 'standard' : string }
export type TransType = { 'claim' : null } |
  { 'distribute' : null } |
  { 'unstake' : null } |
  { 'stake' : null };
export interface _SERVICE extends Farm {}
