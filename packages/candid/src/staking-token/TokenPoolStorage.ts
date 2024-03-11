import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface CycleInfo {
  balance: bigint;
  available: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export interface Page {
  content: Array<Record>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Record {
  to: string;
  stakingTokenSymbol: string;
  rewardTokenSymbol: string;
  tokenId: [] | [bigint];
  incentiveCanisterId: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  transType: TransType;
  from: string;
  pool: [] | [string];
  recipient: string;
  rewardStandard: string;
  timestamp: bigint;
  stakingTokenDecimals: bigint;
  amount: bigint;
  rewardTokenDecimals: bigint;
}
export type Result = { ok: Page } | { err: string };
export type Result_1 = { ok: CycleInfo } | { err: Error };
export interface StakerStorage {
  findRewardRecordPage: ActorMethod<[[] | [string], bigint, bigint], Result>;
  findStakingRecordPage: ActorMethod<[[] | [string], bigint, bigint], Result>;
  getCycleInfo: ActorMethod<[], Result_1>;
  getRewardTrans: ActorMethod<[bigint, bigint], Result>;
  getTrans: ActorMethod<[bigint, bigint], Result>;
  save: ActorMethod<[Record], undefined>;
}
export type TransType =
  | { withdraw: null }
  | { unstaking: null }
  | { staking: null }
  | { endIncentive: null }
  | { claim: null }
  | { unstakeTokenids: null }
  | { deposit: null }
  | { stakeTokenids: null }
  | { createIncentive: null };
export interface _SERVICE extends StakerStorage {}
