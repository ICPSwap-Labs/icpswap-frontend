import type { Principal } from "@icp-sdk/core/principal";
import type { SwapPoolData } from "@icpswap/candid";
import type { Override } from "./global";

export type UserSwapPoolsBalance = Override<
  SwapPoolData,
  { type: "unDeposit" | "unUsed"; balance0: bigint; balance1: bigint }
>;

export type {
  AddLimitOrderInfo,
  AddLiquidityInfo,
  ClaimArgs,
  ClaimInfo,
  CreatePoolArgs,
  DecreaseLiquidityArgs,
  DecreaseLiquidityInfo,
  DepositAndSwapArgs,
  DepositInfo,
  ExecuteLimitOrderInfo,
  FailedTransactionAction,
  GetPoolArgs,
  IncreaseLiquidityArgs,
  LimitOrderKey,
  LimitOrderValue,
  MintArgs,
  OneStepSwapInfo,
  PoolInstaller,
  PoolMetadata,
  PositionInfoWithId,
  RefundInfo,
  RemoveLimitOrderInfo,
  SwapArgs,
  SwapFailedTransaction,
  SwapInfo,
  SwapPoolData,
  SwapPoolToken,
  TickInfoWithId,
  TickLiquidityInfo,
  TransferPositionInfo,
  UserPositionInfo,
  UserPositionInfoWithId,
  UserPositionInfoWithTokenAmount,
  UserWithdrawQueueInfo,
  WithdrawInfo,
} from "@icpswap/candid";

export type LimitOrder = {
  userPositionId: bigint;
  token0InAmount: bigint;
  timestamp: bigint;
  tickLimit: bigint;
  token1InAmount: bigint;
};

export type { PassCode, SwapNFTTokenMetadata } from "@icpswap/candid";

export type PCMMetadata = {
  passcodePrice: bigint;
  tokenCid: Principal;
  factoryCid: Principal;
};

export enum API_SWAP_TRANSACTIONS_TYPES {
  SWAP = "Swap",
  INCREASE = "IncreaseLiquidity",
  ADD = "AddLiquidity",
  MINT = "Mint",
  DECREASE = "DecreaseLiquidity",
  COLLECT = "Claim",
}
