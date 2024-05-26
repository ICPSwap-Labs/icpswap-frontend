import type { TokenAmount } from "./Farm";

export { idlFactory as FarmInterfaceFactory } from "./Farm.did";
export type {
  _SERVICE as Farm,
  StakeRecord as StakingFarmStakeTransaction,
  DistributeRecord as StakingFarmDistributeTransaction,
  FarmInfo,
  Deposit as FarmDepositArgs,
  InitFarmArgs,
} from "./Farm";

export { idlFactory as FarmControllerInterfaceFactory } from "./FarmController.did";
export type {
  _SERVICE as FarmController,
  TVL as FarmTvl,
  CreateFarmArgs,
  FarmStatus as FarmStatusArgs,
} from "./FarmController";

export { idlFactory as FarmStorageInterfaceFactory } from "./FarmStorage.did";
export type { _SERVICE as FarmStorage } from "./FarmStorage";

export type FarmUserTvl = { poolToken0: TokenAmount; poolToken1: TokenAmount };
