export { idlFactory as FarmInterfaceFactory } from "./Farm.did";
export type {
  _SERVICE as Farm,
  Deposit as StakingFarmDepositArgs,
  StakeRecord as StakingFarmStakeTransaction,
  DistributeRecord as StakingFarmDistributeTransaction,
} from "./Farm";

export { idlFactory as FarmControllerInterfaceFactory } from "./FarmController.did";
export type {
  _SERVICE as FarmController,
  FarmInfo as StakingFarmInfo,
} from "./FarmController";

export { idlFactory as FarmStorageInterfaceFactory } from "./FarmStorage.did";
export type { _SERVICE as FarmStorage } from "./FarmStorage";
