export type {
  CreateStakingPoolArgs,
  StakingPoolInfo,
  StakingPoolCycle,
  StakingPoolUserInfo,
  StakingPoolTransaction,
  StakingPoolGlobalData,
  StakingPoolControllerPoolInfo,
  StakeIndexPoolInfo,
  StakeAprInfo,
} from "@icpswap/candid";

export enum StakingState {
  LIVE = "LIVE",
  NOT_STARTED = "NOT_STARTED",
  FINISHED = "FINISHED",
}
