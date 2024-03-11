import { Override, StakingPoolControllerPoolInfo, StakingTokenPoolInfo, StakingPoolUserInfo } from "@icpswap/types";
import type { PublicPoolInfo as V1Pool } from "candid/swap-v2/SingleSmartChef.did";

export type UnusedBalance = Override<StakingPoolControllerPoolInfo, { balance: bigint }>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export enum STAKING_POOL_VERSION {
  version1 = "1.0",
  version2 = "2.0",
}

export type PoolData = StakingTokenPoolInfo | V1Pool;

export type UserStakingInfo = {
  amount: bigint;
  reward: bigint;
};
