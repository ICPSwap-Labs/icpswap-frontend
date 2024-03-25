import type { Principal } from '@dfinity/principal';

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
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_3 = { 'ok' : PublicUserInfo } |
  { 'err' : string };
export type Result_4 = { 'ok' : PublicPoolInfo } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<string> } |
  { 'err' : string };
export interface SingleSmartChef {
  'addAdmin' : (arg_0: string) => Promise<Result_1>,
  'changePoolInfo' : (arg_0: ChangePoolInfo) => Promise<undefined>,
  'cycleAvailable' : () => Promise<bigint>,
  'cycleBalance' : () => Promise<bigint>,
  'deposit' : (arg_0: bigint) => Promise<Result>,
  'endSingleSmartChefCanister' : () => Promise<undefined>,
  'getAdminList' : () => Promise<Result_5>,
  'getAllUserInfoEntries' : () => Promise<string>,
  'getPoolInfo' : () => Promise<Result_4>,
  'getStorageChanisterId' : () => Promise<string>,
  'getUserInfo' : (arg_0: User) => Promise<Result_3>,
  'harvest' : () => Promise<Result_2>,
  'pendingReward' : (arg_0: User) => Promise<Result_2>,
  'removeAdmin' : (arg_0: string) => Promise<Result_1>,
  'resetReward' : (arg_0: bigint, arg_1: bigint) => Promise<undefined>,
  'stopReward' : () => Promise<undefined>,
  'updateMultiplier' : (arg_0: bigint) => Promise<undefined>,
  'updatePool' : () => Promise<undefined>,
  'withdraw' : (arg_0: bigint) => Promise<Result>,
}
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export type _SERVICE = SingleSmartChef
