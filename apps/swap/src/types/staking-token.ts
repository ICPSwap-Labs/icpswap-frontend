import { Override, StakingPoolControllerPoolInfo, StakingPoolUserInfo } from "@icpswap/types";

export type UnusedBalance = Override<
  StakingPoolControllerPoolInfo,
  { poolId: string; balance: bigint; rewardTokenId: string }
>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export enum FilterState {
  "ALL" = "ALL",
  "NOT_STARTED" = "NOT_STARTED",
  "LIVE" = "LIVE",
  "FINISHED" = "FINISHED",
  "CLOSED" = "CLOSED",
  "YOUR" = "YOUR",
}

export type UserPendingRewards = Override<
  StakingPoolUserInfo,
  { poolId: string; rewardAmount: bigint; stakingAmount: bigint; rewardTokenId: string; stakeTokenId: string }
>;
