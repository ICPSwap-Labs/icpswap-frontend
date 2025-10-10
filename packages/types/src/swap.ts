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
  LimitOrderKey,
  LimitOrderValue,
  LimitTransaction,
  LimitTransactionResult,
  PoolInstaller,
  DepositAndSwapArgs,
  SwapFailedTransaction,
  AddLimitOrderInfo,
  WithdrawInfo,
  RemoveLimitOrderInfo,
  OneStepSwapInfo,
  DepositInfo,
  RefundInfo,
  SwapInfo,
  ExecuteLimitOrderInfo,
  TransferPositionInfo,
  DecreaseLiquidityInfo,
  ClaimInfo,
  FailedTransactionAction,
  AddLiquidityInfo,
} from "@icpswap/candid";

export type LimitOrder = {
  userPositionId: bigint;
  token0InAmount: bigint;
  timestamp: bigint;
  tickLimit: bigint;
  token1InAmount: bigint;
};

export type { SwapNFTTokenMetadata, PassCode } from "@icpswap/candid";

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
