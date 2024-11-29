import type { SwapPoolData } from "@icpswap/candid";
import type { Principal } from "@dfinity/principal";
import { Override } from "./global";

export type UserSwapPoolsBalance = Override<
  SwapPoolData,
  { type: "unDeposit" | "unUsed"; balance0: bigint; balance1: bigint }
>;

export type { GetPoolArgs, CreatePoolArgs } from "@icpswap/candid";

export type {
  TickLiquidityInfo,
  PoolMetadata,
  MintArgs,
  UserPositionInfo,
  DecreaseLiquidityArgs,
  IncreaseLiquidityArgs,
  SwapArgs,
  ClaimArgs,
  UserPositionInfoWithTokenAmount,
  UserPositionInfoWithId,
  PositionInfoWithId,
  TickInfoWithId,
  SwapPoolData,
  SwapPoolToken,
  Ticket,
  PositionPricePeriodRange,
  PoolAPRs,
  TokenAnalysisData,
} from "@icpswap/candid";

export type { SwapNFTTokenMetadata, PassCode } from "@icpswap/candid";

export type PCMMetadata = {
  passcodePrice: bigint;
  tokenCid: Principal;
  factoryCid: Principal;
};
