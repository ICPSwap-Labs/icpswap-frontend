export type {
  CreateStakingPoolArgs,
  StakeAprInfo,
  StakeGlobalDataInfo,
  StakeIndexPoolInfo,
  StakeUserStakeInfo,
  StakingPoolControllerPoolInfo,
  StakingPoolCycle,
  StakingPoolGlobalData,
  StakingPoolInfo,
  StakingPoolTransaction,
  StakingPoolUserInfo,
} from "@icpswap/candid";

export enum StakingState {
  LIVE = "LIVE",
  NOT_STARTED = "NOT_STARTED",
  FINISHED = "FINISHED",
}
