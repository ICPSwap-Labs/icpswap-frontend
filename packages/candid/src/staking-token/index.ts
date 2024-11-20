export { idlFactory as TokenPoolInterfaceFactory } from "./TokenPool.did";
export type {
  _SERVICE as TokenPool,
  PublicStakingPoolInfo as StakingPoolInfo,
  PublicUserInfo as StakingPoolUserInfo,
  CycleInfo as StakingPoolCycle,
  Record as StakingPoolTransaction,
} from "./TokenPool";

export { idlFactory as StakingPoolControllerInterfaceFactory } from "./StakingPoolController.did";
export type {
  _SERVICE as StakingPoolController,
  InitRequest as CreateStakingPoolArgs,
  StakingPoolInfo as StakingPoolControllerPoolInfo,
  GlobalDataInfo as StakingPoolGlobalData,
  TokenGlobalDataInfo as StakeGlobalDataInfo,
} from "./StakingPoolController";

export { idlFactory as StakeIndexInterfaceFactor } from "./StakeIndex.did";
export type {
  _SERVICE as StakeIndex,
  UserPool as StakeIndexPoolInfo,
  APRInfo as StakeAprInfo,
  UserStakedToken as StakeUserStakeInfo,
} from "./StakeIndex";
