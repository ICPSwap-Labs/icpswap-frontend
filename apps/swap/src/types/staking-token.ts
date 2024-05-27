import { Override, StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";
import type { PublicPoolInfo as V1Pool } from "candid/swap-v2/SingleSmartChef.did";

export type UnusedBalance = Override<StakingPoolControllerPoolInfo, { balance: bigint }>;

export enum STATE {
  LIVE = "LIVE",
  UPCOMING = "UNSTART",
  FINISHED = "FINISHED",
}

export type PoolData = StakingPoolInfo | V1Pool;
