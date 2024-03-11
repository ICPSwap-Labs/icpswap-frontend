import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export interface GlobalDataResult {
  'count' : bigint,
  'globalTVL' : number,
  'globalRewardTVL' : number,
}
export interface IncentiveKey {
  'startTime' : bigint,
  'rewardTokenSymbol' : string,
  'rewardToken' : string,
  'endTime' : bigint,
  'pool' : string,
  'rewardStandard' : string,
  'rewardTokenFee' : bigint,
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
export interface Page {
  'content' : Array<SmartChefType>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<PublicIncentive>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface PublicIncentive {
  'storageCanisterId' : string,
  'startTime' : bigint,
  'status' : string,
  'rewardTokenSymbol' : string,
  'numberOfStakes' : bigint,
  'incentiveCanisterId' : string,
  'rewardToken' : string,
  'totalLiquidity' : bigint,
  'endTime' : bigint,
  'incentive' : string,
  'totalAmount0' : bigint,
  'totalAmount1' : bigint,
  'pool' : string,
  'refundee' : string,
  'rewardStandard' : string,
  'totalRewardClaimed' : bigint,
  'stakesTokenIds' : Array<bigint>,
  'rewardTokenFee' : bigint,
  'poolToken0' : string,
  'poolToken1' : string,
  'poolFee' : bigint,
  'totalReward' : bigint,
  'userTotalAmount0' : bigint,
  'userTotalAmount1' : bigint,
  'rewardTokenDecimals' : bigint,
  'userNumberOfStakes' : bigint,
  'totalRewardUnclaimed' : bigint,
  'totalSecondsClaimedX128' : bigint,
  'userTotalLiquidity' : bigint,
}
export type ResponseResult = { 'ok' : GlobalDataResult } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Page_1 } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : string } |
  { 'err' : string };
export type Result = { 'ok' : Page } |
  { 'err' : Page };
export type Result_1 = { 'ok' : SingleSmartChefGlobalDataType } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export interface SingleSmartChefGlobalDataType {
  'earned' : number,
  'stakerNumber' : number,
}
export interface SmartChefType {
  'stakingTokenSymbol' : string,
  'storageCanisterId' : string,
  'startTime' : bigint,
  'rewardTokenSymbol' : string,
  'creator' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'name' : string,
  'createTime' : bigint,
  'stakingTokenFee' : bigint,
  'rewardTokenFee' : bigint,
  'stakingTokenDecimals' : bigint,
  'bonusEndTime' : bigint,
  'rewardTokenDecimals' : bigint,
  'canisterId' : string,
}
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], boolean>,
  'createIncentive' : ActorMethod<[IncentiveKey, bigint], ResponseResult_2>,
  'createSingleSmartChef' : ActorMethod<[InitRequest], Result_2>,
  'cycleAvailable' : ActorMethod<[], bigint>,
  'cycleBalance' : ActorMethod<[], bigint>,
  'destroyStakerCanister' : ActorMethod<[string], undefined>,
  'findIncentivesPoolsList' : ActorMethod<[bigint, bigint], ResponseResult_1>,
  'findUserCreateIncentives' : ActorMethod<
    [User, bigint, bigint],
    ResponseResult_1
  >,
  'getAdminList' : ActorMethod<[], Array<string>>,
  'getErrorMsg' : ActorMethod<[], string>,
  'getGlobalData' : ActorMethod<[], ResponseResult>,
  'getInitCycles' : ActorMethod<[], bigint>,
  'getSingleSmartGlobalData' : ActorMethod<[], Result_1>,
  'getSwapNFTCanisterId' : ActorMethod<[], string>,
  'getSwapPositionManagerCanisterId' : ActorMethod<[], string>,
  'getSwapRouterCanisterId' : ActorMethod<[], string>,
  'getWicpCanisterId' : ActorMethod<[], string>,
  'getWicpDecimals' : ActorMethod<[], bigint>,
  'isAdmin' : ActorMethod<[string], boolean>,
  'removeAdmin' : ActorMethod<[string], boolean>,
  'setHeartRate' : ActorMethod<[bigint], bigint>,
  'setInitCycles' : ActorMethod<[bigint], undefined>,
  'setMaxIncentiveDuration' : ActorMethod<[bigint], undefined>,
  'setMaxIncentiveStartLeadTime' : ActorMethod<[bigint], undefined>,
  'setSwapNFTCanisterId' : ActorMethod<[string], undefined>,
  'setSwapPositionManagerCanisterId' : ActorMethod<[string], undefined>,
  'setSwapRouterCanisterId' : ActorMethod<[string], undefined>,
  'setWicpCanisterId' : ActorMethod<[string], undefined>,
  'setWicpDecimals' : ActorMethod<[bigint], undefined>,
  'singleSmartChefList' : ActorMethod<[bigint, bigint], Result>,
}
