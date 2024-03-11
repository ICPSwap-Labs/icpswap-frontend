import { Override } from "@icpswap/types";
import { type StakingPoolControllerPoolInfo, type StakingTokenPoolInfo } from "@icpswap/types";

import type { PublicPoolInfo as V1Pool } from "constants/v2/SingleSmartChef.did";

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

export type V1PoolData = Override<
  V1Pool,
  {
    stakingToken: { address: string; standard: string };
    rewardToken: { address: string; standard: string };
    storageCid: string;
  }
>;

export type V2PoolData = StakingTokenPoolInfo;

export type PoolData = V1PoolData | V2PoolData;

export type UserStakingInfo = {
  amount: bigint;
  reward: bigint;
};
