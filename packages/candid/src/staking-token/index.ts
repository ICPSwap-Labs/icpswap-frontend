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
} from "./StakingPoolController";

export { idlFactory as V1TokenPoolInterfaceFactory } from "./V1TokenPool.did";
export type {
  _SERVICE as V1TokenPool,
  PublicTokenPoolInfo as V1StakingPoolInfo,
  PublicUserInfo as V1StakingPoolUserInfo,
} from "./V1TokenPool";

export { idlFactory as V1TokenPoolControllerInterfaceFactory } from "./V1TokenPoolController.did";
export type {
  _SERVICE as V1TokenPoolController,
  InitRequest as V1StakingPoolCreateArgs,
  TokenPoolInfo as V1StakingPoolControllerPoolInfo,
} from "./V1TokenPoolController";

export { idlFactory as V1TokenPoolStorageInterfaceFactory } from "./V1TokenPoolStorage.did";
export type { _SERVICE as V1TokenPoolStorage, Record as V1StakingPoolTransaction } from "./V1TokenPoolStorage";
