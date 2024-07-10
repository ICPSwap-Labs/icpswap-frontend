import { Override } from "@icpswap/types";

import { PublicUserInfo as StakingPoolUserInfo, PublicTokenPoolInfo } from "./V1TokenPool";
import { TokenPoolInfo as StakingPoolControllerPoolInfo } from "./V1TokenPoolController";

export { idlFactory as TokenPoolInterfaceFactory } from "./V1TokenPool.did";
export type {
  _SERVICE as TokenPool,
  PublicTokenPoolInfo as StakingTokenPoolInfo,
  PublicUserInfo as StakingPoolUserInfo,
  CycleInfo as StakingPoolCycle,
} from "./V1TokenPool";

export { idlFactory as TokenPoolControllerInterfaceFactory } from "./V1TokenPoolController.did";
export type {
  _SERVICE as TokenPoolController,
  InitRequest as CreateTokenPoolArgs,
  TokenPoolInfo as StakingPoolControllerPoolInfo,
  GlobalDataInfo as StakingPoolGlobalData,
} from "./V1TokenPoolController";

export type UserStakingInfo = {
  amount: bigint;
  reward: bigint;
};

export type UnusedBalance = Override<
  StakingPoolControllerPoolInfo,
  { poolId: string; balance: bigint; rewardTokenId: string }
>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export type PoolData = PublicTokenPoolInfo;

export type UserPendingRewards = Override<
  StakingPoolUserInfo,
  { poolId: string; amount: bigint; rewardTokenId: string }
>;
