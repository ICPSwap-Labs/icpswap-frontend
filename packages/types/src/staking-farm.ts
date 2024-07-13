export type {
  CreateFarmArgs,
  FarmTvl,
  FarmDepositArgs,
  StakingFarmDistributeTransaction,
  StakingFarmStakeTransaction,
  FarmInfo,
  InitFarmArgs,
  FarmUserTvl,
  FarmStatusArgs,
  FarmFilterCondition,
  FarmRewardInfo,
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

export type FarmState = "LIVE" | "NOT_STARTED" | "CLOSED" | "FINISHED";
