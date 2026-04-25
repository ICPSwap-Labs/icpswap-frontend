import type { FarmInfo } from "@icpswap/candid";
import type { Override } from "./global";

export type {
  CreateFarmArgs,
  FarmDepositArgs,
  FarmFilterCondition,
  FarmInfo,
  FarmRewardInfo,
  FarmStatusArgs,
  FarmTvl,
  FarmUserTvl,
  InitFarmArgs,
  StakingFarmDistributeTransaction,
  StakingFarmStakeTransaction,
} from "@icpswap/candid";

export type FarmRewardMetadata = {
  secondPerCycle: bigint;
  totalRewardHarvested: bigint;
  totalRewardBalance: bigint;
  totalRewardFee: bigint;
  rewardPerCycle: bigint;
  totalCycleCount: bigint;
  totalRewardUnharvested: bigint;
  currentCycleCount: bigint;
  totalReward: bigint;
};

export type FarmInfoWithId = Override<FarmInfo, { id: string }>;

export type FarmState = "LIVE" | "NOT_STARTED" | "CLOSED" | "FINISHED";
