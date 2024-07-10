export type {
  CreateStakingPoolArgs,
  StakingPoolInfo,
  StakingPoolCycle,
  StakingPoolUserInfo,
  StakingPoolTransaction,
  StakingPoolGlobalData,
  StakingPoolControllerPoolInfo,
  StakingUserStoragePoolInfo,
} from "@icpswap/candid";

export enum StakingState {
  LIVE = "LIVE",
  NOT_STARTED = "NOT_STARTED",
  FINISHED = "FINISHED",
}
