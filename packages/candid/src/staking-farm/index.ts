import type { TokenAmount } from "./Farm";

export type {
  _SERVICE as Farm,
  Deposit as FarmDepositArgs,
  DistributeRecord as StakingFarmDistributeTransaction,
  FarmInfo,
  InitFarmArgs,
  StakeRecord as StakingFarmStakeTransaction,
  TVL as FarmTvl,
} from "./Farm";
export { idlFactory as FarmInterfaceFactory } from "./Farm.did";
export type { _SERVICE as FarmController, CreateFarmArgs } from "./FarmController";
export { idlFactory as FarmControllerInterfaceFactory } from "./FarmController.did";
export type {
  _SERVICE as FarmIndex,
  FarmRewardInfo,
  FarmStatus as FarmStatusArgs,
  SearchCondition as FarmFilterCondition,
} from "./FarmIndex";
export { idlFactory as FarmIndexInterfaceFactory } from "./FarmIndex.did";
export type { _SERVICE as FarmStorage } from "./FarmStorage";
export { idlFactory as FarmStorageInterfaceFactory } from "./FarmStorage.did";

export type FarmUserTvl = { poolToken0: TokenAmount; poolToken1: TokenAmount };
