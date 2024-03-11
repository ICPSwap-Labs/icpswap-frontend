import type { Principal } from '@dfinity/principal';
export interface Page {
  'content' : Array<Record>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Record {
  'to' : string,
  'stakingTokenSymbol' : string,
  'rewardTokenSymbol' : string,
  'tokenId' : [] | [bigint],
  'incentiveCanisterId' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'stakingStandard' : string,
  'transType' : TransType,
  'from' : string,
  'pool' : [] | [string],
  'recipient' : string,
  'rewardStandard' : string,
  'timestamp' : bigint,
  'stakingTokenDecimals' : bigint,
  'amount' : bigint,
  'rewardTokenDecimals' : bigint,
}
export type ResponseResult = { 'ok' : Page } |
  { 'err' : string };
export interface SwapStakerStorage {
  'cycleAvailable' : () => Promise<bigint>,
  'cycleBalance' : () => Promise<bigint>,
  'getRewardTrans' : (arg_0: bigint, arg_1: bigint) => Promise<ResponseResult>,
  'getTrans' : (arg_0: bigint, arg_1: bigint) => Promise<ResponseResult>,
  'save' : (arg_0: Record) => Promise<undefined>,
  'setSwapStakerCanister' : (arg_0: string) => Promise<undefined>,
}
export type TransType = { 'withdraw' : null } |
  { 'unstaking' : null } |
  { 'staking' : null } |
  { 'endIncentive' : null } |
  { 'claim' : null } |
  { 'unstakeTokenids' : null } |
  { 'deposit' : null } |
  { 'stakeTokenids' : null } |
  { 'createIncentive' : null };
export interface _SERVICE extends SwapStakerStorage {}
