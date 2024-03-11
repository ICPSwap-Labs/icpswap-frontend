export { idlFactory as TokenPoolInterfaceFactory } from "./TokenPool.did";
export type {
  _SERVICE as TokenPool,
  PublicTokenPoolInfo as StakingTokenPoolInfo,
  PublicUserInfo as StakingPoolUserInfo,
  CycleInfo as StakingPoolCycle,
} from "./TokenPool";

export { idlFactory as TokenPoolControllerInterfaceFactory } from "./TokenPoolController.did";
export type {
  _SERVICE as TokenPoolController,
  InitRequest as CreateTokenPoolArgs,
  TokenPoolInfo as StakingPoolControllerPoolInfo,
  GlobalDataInfo as StakingPoolGlobalData,
} from "./TokenPoolController";

export { idlFactory as TokenPoolStorageInterfaceFactory } from "./TokenPoolStorage.did";
export type {
  _SERVICE as TokenPoolStorage,
  Record as StakingPoolTransaction,
} from "./TokenPoolStorage";

export { idlFactory as V1TokenPoolInterfaceFactory } from "./V1TokenPool.did";
export type {
  _SERVICE as V1TokenPool,
  PublicPoolInfo as V1StakingPoolInfo,
  PublicUserInfo as V1StakingPoolUserInfo,
} from "./V1TokenPool";

export { idlFactory as V1TokenPoolControllerInterfaceFactory } from "./V1TokenPoolController.did";
export type {
  _SERVICE as V1TokenPoolController,
  InitRequest as V1StakingPoolCreateArgs,
} from "./V1TokenPoolController";

export { idlFactory as V1TokenPoolStorageInterfaceFactory } from "./V1TokenPoolStorage.did";
export type {
  _SERVICE as V1TokenPoolStorage,
  Record as V1StakingPoolTransaction,
} from "./V1TokenPoolStorage";
