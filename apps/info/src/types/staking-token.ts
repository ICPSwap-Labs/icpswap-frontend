import { Override } from "@icpswap/types";
import type { StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";

export type UnusedBalance = Override<StakingPoolControllerPoolInfo, { balance: bigint }>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export type PoolData = StakingPoolInfo;

export type UserStakingInfo = {
  amount: bigint;
  reward: bigint;
};
