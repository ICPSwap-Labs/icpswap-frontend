export type {
  StakingFarmInfo,
  StakingFarmDepositArgs,
  StakingFarmDistributeTransaction,
  StakingFarmStakeTransaction,
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
