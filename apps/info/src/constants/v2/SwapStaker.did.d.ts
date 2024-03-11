import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export interface Deposit {
  'tokenId' : bigint,
  'numberOfStakes' : bigint,
  'tickUpper' : bigint,
  'owner' : string,
  'pool' : string,
  'tokenMetadata' : TokenMetadata,
  'holder' : string,
  'tickLower' : bigint,
}
export interface InitProxyCanister {
  'storageCanisterId' : string,
  'swapNFTCanisterId' : string,
  'wicpCanisterId' : string,
  'swapRouterCanisterId' : string,
  'swapPositionManagerCanisterId' : string,
  'wicpDecimals' : bigint,
}
export interface KVPair { 'k' : string, 'v' : string }
export interface Page {
  'content' : Array<TokenMetadata__1>,
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
export type ResponseResult = { 'ok' : string } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : Stake } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : RewardInfo } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : PublicIncentive } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : Deposit } |
  { 'err' : string };
export type ResponseResult_5 = { 'ok' : Page } |
  { 'err' : string };
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface RewardInfo { 'reward' : bigint, 'secondsInsideX128' : bigint }
export interface Stake {
  'liquidityNoOverflow' : bigint,
  'secondsPerLiquidityInsideInitialX128' : bigint,
  'liquidityIfOverflow' : bigint,
}
export interface SwapStaker {
  'addAdmin' : (arg_0: string) => Promise<boolean>,
  'cycleAvailable' : () => Promise<bigint>,
  'cycleBalance' : () => Promise<bigint>,
  'endIncentive' : () => Promise<ResponseResult>,
  'findUserIncentivesTokenids' : (
      arg_0: User,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<ResponseResult_5>,
  'getAdminList' : () => Promise<Array<string>>,
  'getDeposits' : (arg_0: bigint) => Promise<ResponseResult_4>,
  'getIncentives' : (arg_0: User) => Promise<ResponseResult_3>,
  'getRewardInfo' : (arg_0: Array<bigint>) => Promise<ResponseResult_2>,
  'getStakes' : (arg_0: bigint) => Promise<ResponseResult_1>,
  'getSwapNFTCanisterId' : () => Promise<string>,
  'getSwapPositionManagerCanisterId' : () => Promise<string>,
  'getSwapRouterCanisterId' : () => Promise<string>,
  'getSwapStakerStorageCanisterId' : () => Promise<string>,
  'getWicpCanisterId' : () => Promise<string>,
  'getWicpDecimals' : () => Promise<bigint>,
  'initIncentives' : (arg_0: PublicIncentive) => Promise<undefined>,
  'isAdmin' : (arg_0: string) => Promise<boolean>,
  'openReward' : (arg_0: bigint) => Promise<undefined>,
  'removeAdmin' : (arg_0: string) => Promise<boolean>,
  'setHeartFeeRate' : (arg_0: bigint) => Promise<undefined>,
  'setSwapNFTCanisterId' : (arg_0: string) => Promise<undefined>,
  'setSwapRouterCanisterId' : (arg_0: string) => Promise<undefined>,
  'setSwapStakerStorageCanisterId' : (arg_0: string) => Promise<undefined>,
  'setWicpCanisterId' : (arg_0: string) => Promise<undefined>,
  'setWicpDecimals' : (arg_0: bigint) => Promise<undefined>,
  'setswapPositionManagerCanisterId' : (arg_0: string) => Promise<undefined>,
  'stakeTokenids' : (arg_0: bigint) => Promise<ResponseResult>,
  'transferToken' : (arg_0: bigint) => Promise<Result>,
  'unstakeTokenids' : (arg_0: bigint) => Promise<ResponseResult>,
}
export type TokenIndex = number;
export interface TokenMetadata {
  'cId' : string,
  'tokenId' : TokenIndex,
  'owner' : AccountIdentifier,
  'metadata' : [] | [Array<number>],
  'link' : string,
  'name' : string,
  'minter' : AccountIdentifier,
  'filePath' : string,
  'fileType' : string,
  'mintTime' : bigint,
  'introduction' : string,
  'attributes' : Array<KVPair>,
  'royalties' : bigint,
  'nftType' : string,
  'artistName' : string,
}
export interface TokenMetadata__1 {
  'cId' : string,
  'tokenId' : TokenIndex,
  'owner' : AccountIdentifier,
  'metadata' : [] | [Array<number>],
  'link' : string,
  'name' : string,
  'minter' : AccountIdentifier,
  'filePath' : string,
  'fileType' : string,
  'mintTime' : bigint,
  'introduction' : string,
  'attributes' : Array<KVPair>,
  'royalties' : bigint,
  'nftType' : string,
  'artistName' : string,
}
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE extends SwapStaker {}
