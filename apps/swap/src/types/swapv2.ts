import { Override } from "@icpswap/types";
import { QueryPositionResult as PositionResult } from "candid/swap-v2/SwapPositionManager";

export type {
  QueryPositionResult as PositionResult,
  IncreaseLiquidityParams,
  DecreaseLiquidityParams,
  LiquidityType as IncreaseLiquidityResult,
  ResultAmount as DecreaseLiquidityResult,
  PoolKey,
  TVLResult,
  MintResult,
  TickLiquidityInfo,
  ResultAmount as CollectResult,
  CollectParams,
  VolumeMapType as VolumeResult,
  QueryPositionResult,
} from "candid/swap-v2/SwapPositionManager";
export type { PoolInfo } from "candid/swap-v2/SwapFactory";

export type { TransactionsType as SwapRecordInfo } from "candid/swap-v2/InfoBase";
export type { PublicPoolOverView as SwapPoolRecord } from "candid/swap-v2/InfoPools";

export type UserPosition = Override<PositionResult, { id: bigint }>;

export type { PoolInfo as SwapPoolInfo } from "candid/swap-v2/SwapPool";
