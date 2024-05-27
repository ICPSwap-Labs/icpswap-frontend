import { Override } from "@icpswap/types";
import type { StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";

export type UnusedBalance = Override<StakingPoolControllerPoolInfo, { balance: bigint }>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export type V2PoolData = StakingPoolInfo;

export type PoolData = V2PoolData;

export type UserStakingInfo = {
  amount: bigint;
  reward: bigint;
};
