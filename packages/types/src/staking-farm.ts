export type {
  CreateFarmArgs,
  FarmTvl,
  FarmDepositArgs,
  StakingFarmDistributeTransaction,
  StakingFarmStakeTransaction,
  FarmInfo,
  FarmStatusArgs,
} from "@icpswap/candid";

export type FarmMetadata = {
  secondPerCycle: bigint;
  totalRewardBalance: bigint;
  rewardPerCycle: bigint;
  totalRewardClaimed: bigint;
  totalCycleCount: bigint;
  currentCycleCount: bigint;
  totalReward: bigint;
  totalRewardUnclaimed: bigint;
};

export type FarmState = "LIVE" | "NOT_STARTED" | "CLOSED" | "FINISHED";
