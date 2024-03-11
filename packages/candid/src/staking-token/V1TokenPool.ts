import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export interface ChangePoolInfo {
  'stakingTokenSymbol' : string,
  'lastRewardTime' : bigint,
  'rewardTokenSymbol' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'stakingStandard' : string,
  'rewardPerTime' : bigint,
  'rewardStandard' : string,
  'stakingTokenFee' : bigint,
  'rewardTokenFee' : bigint,
  'stakingTokenDecimals' : bigint,
  'bonusEndTime' : bigint,
  'BONUS_MULTIPLIER' : bigint,
  'rewardTokenDecimals' : bigint,
}
export interface InitRequest {
  'stakingTokenSymbol' : string,
  'startTime' : bigint,
  'rewardTokenSymbol' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'stakingStandard' : string,
  'rewardPerTime' : bigint,
  'name' : string,
  'rewardStandard' : string,
  'stakingTokenFee' : bigint,
  'rewardTokenFee' : bigint,
  'stakingTokenDecimals' : bigint,
  'bonusEndTime' : bigint,
  'BONUS_MULTIPLIER' : bigint,
  'rewardTokenDecimals' : bigint,
}
export interface Ledger {
  'staking' : number,
  'claim' : number,
  'stakingBalance' : number,
  'unStaking' : number,
  'rewardBalance' : number,
}
export interface PublicPoolInfo {
  'stakingTokenSymbol' : string,
  'storageCanisterId' : string,
  'lastRewardTime' : bigint,
  'totalDeposit' : bigint,
  'rewardTokenSymbol' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'stakingStandard' : string,
  'rewardPerTime' : bigint,
  'rewardStandard' : string,
  'stakingTokenFee' : bigint,
  'rewardDebt' : bigint,
  'rewardTokenFee' : bigint,
  'accPerShare' : bigint,
  'stakingTokenDecimals' : bigint,
  'bonusEndTime' : bigint,
  'BONUS_MULTIPLIER' : bigint,
  'rewardTokenDecimals' : bigint,
  'allocPoint' : bigint,
}
export interface PublicUserInfo {
  'pendingReward' : bigint,
  'rewardDebt' : bigint,
  'amount' : bigint,
}
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_4 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_5 = { 'ok' : PublicUserInfo } |
  { 'err' : string };
export type Result_6 = { 'ok' : PublicPoolInfo } |
  { 'err' : string };
export type Result_7 = { 'ok' : Array<string> } |
  { 'err' : string };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], Result_3>,
  'changePoolInfo' : ActorMethod<[ChangePoolInfo], undefined>,
  'clearLocksMap' : ActorMethod<[], undefined>,
  'compareLedger' : ActorMethod<[], Ledger>,
  'cycleAvailable' : ActorMethod<[], bigint>,
  'cycleBalance' : ActorMethod<[], bigint>,
  'deposit' : ActorMethod<[bigint], Result_2>,
  'endSingleSmartChefCanister' : ActorMethod<[], undefined>,
  'getAdminList' : ActorMethod<[], Result_7>,
  'getAllLocks' : ActorMethod<[], Array<[string, bigint]>>,
  'getAllUserInfoEntries' : ActorMethod<[], string>,
  'getPoolInfo' : ActorMethod<[], Result_6>,
  'getUserInfo' : ActorMethod<[User], Result_5>,
  'harvest' : ActorMethod<[], Result_4>,
  'initLedger' : ActorMethod<[], undefined>,
  'pendingReward' : ActorMethod<[User], Result_4>,
  'removeAdmin' : ActorMethod<[string], Result_3>,
  'resetReward' : ActorMethod<[bigint, bigint], undefined>,
  'setInitLedger' : ActorMethod<[Ledger], Ledger>,
  'stopReward' : ActorMethod<[], undefined>,
  'updateMultiplier' : ActorMethod<[bigint], undefined>,
  'updatePool' : ActorMethod<[], undefined>,
  'withdraw' : ActorMethod<[bigint], Result_2>,
}