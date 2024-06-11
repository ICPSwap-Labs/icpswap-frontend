import { Override, StakingPoolControllerPoolInfo, StakingPoolInfo, StakingPoolUserInfo } from "@icpswap/types";
import type { PublicPoolInfo as V1Pool } from "candid/swap-v2/SingleSmartChef.did";

export type UnusedBalance = Override<
  StakingPoolControllerPoolInfo,
  { poolId: string; balance: bigint; rewardTokenId: string }
>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export type PoolData = StakingPoolInfo | V1Pool;

export type UserPendingRewards = Override<
  StakingPoolUserInfo,
  { poolId: string; amount: bigint; rewardTokenId: string }
>;
