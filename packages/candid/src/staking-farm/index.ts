import type { TokenAmount } from "./Farm";

export { idlFactory as FarmInterfaceFactory } from "./Farm.did";
export type {
  _SERVICE as Farm,
  StakeRecord as StakingFarmStakeTransaction,
  DistributeRecord as StakingFarmDistributeTransaction,
  FarmInfo,
  Deposit as FarmDepositArgs,
  InitFarmArgs,
  TVL as FarmTvl,
} from "./Farm";

export { idlFactory as FarmControllerInterfaceFactory } from "./FarmController.did";
export type { _SERVICE as FarmController, CreateFarmArgs } from "./FarmController";

export { idlFactory as FarmStorageInterfaceFactory } from "./FarmStorage.did";
export type { _SERVICE as FarmStorage } from "./FarmStorage";

export { idlFactory as FarmIndexInterfaceFactory } from "./FarmIndex.did";
export type {
  _SERVICE as FarmIndex,
  SearchCondition as FarmFilterCondition,
  FarmStatus as FarmStatusArgs,
  FarmRewardInfo,
} from "./FarmIndex";

export type FarmUserTvl = { poolToken0: TokenAmount; poolToken1: TokenAmount };
