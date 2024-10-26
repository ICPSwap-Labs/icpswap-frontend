import { Override } from "@icpswap/types";

import { PublicUserInfo as StakingPoolUserInfo, PublicTokenPoolInfo } from "./TokenPool";
import { TokenPoolInfo as StakingPoolControllerPoolInfo } from "./TokenPoolController";

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
