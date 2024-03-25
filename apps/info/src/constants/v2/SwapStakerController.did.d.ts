import type { Principal } from '@dfinity/principal';

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
export interface _SERVICE {
  'addAdmin' : (arg_0: string) => Promise<boolean>,
  'addControllers' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'createIncentive' : (arg_0: IncentiveKey, arg_1: bigint) => Promise<
      ResponseResult_2
    >,
  'createSingleSmartChef' : (arg_0: InitRequest) => Promise<Result_2>,
  'cycleAvailable' : () => Promise<bigint>,
  'cycleBalance' : () => Promise<bigint>,
  'deleteSingleSmartList' : (arg_0: string) => Promise<undefined>,
  'destroyStakerCanister' : (arg_0: string) => Promise<undefined>,
  'findIncentivesPoolsList' : (arg_0: bigint, arg_1: bigint) => Promise<
      ResponseResult_1
    >,
  'getAdminList' : () => Promise<Array<string>>,
  'getCanister' : () => Promise<
      {
        'positionManager' : string,
        'wicp' : string,
        'swapNFTCanisterId' : string,
        'router' : string,
        'wicpDecimals' : bigint,
      }
    >,
  'getGlobalData' : () => Promise<ResponseResult>,
  'getInitCycles' : () => Promise<bigint>,
  'getSingleSmartGlobalData' : () => Promise<Result_1>,
  'isAdmin' : (arg_0: string) => Promise<boolean>,
  'removeAdmin' : (arg_0: string) => Promise<boolean>,
  'setHeartRate' : (arg_0: bigint) => Promise<bigint>,
  'setInitCycles' : (arg_0: bigint) => Promise<undefined>,
  'setSwapNFTCanisterId' : (arg_0: string) => Promise<undefined>,
  'setSwapPositionManagerCanisterId' : (arg_0: string) => Promise<undefined>,
  'setSwapRouterCanisterId' : (arg_0: string) => Promise<undefined>,
  'setWicpCanisterId' : (arg_0: string) => Promise<undefined>,
  'setWicpDecimals' : (arg_0: bigint) => Promise<undefined>,
  'singleSmartChefList' : (arg_0: bigint, arg_1: bigint) => Promise<Result>,
}
