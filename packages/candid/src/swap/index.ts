import type { Principal } from "@icp-sdk/core/principal";
import type { Passcode as PassCode } from "./Factory";

export type {
  _SERVICE as SwapFactory,
  CreatePoolArgs,
  GetPoolArgs,
  PoolData as SwapPoolData,
  PoolInstaller,
  Token as SwapPoolToken,
} from "./Factory";
export { idlFactory as SwapFactoryInterfaceFactory } from "./Factory.did";
export type {
  _SERVICE as LimitTransactionService,
  LimitOrder as LimitTransaction,
  QueryResult as LimitTransactionResult,
} from "./LimitTransaction";
export { idlFactory as LimitTransactionInterfaceFactory } from "./LimitTransaction.did";
export type { _SERVICE as PassCodeManagerService } from "./PassCodeManager";
export { idlFactory as PassCodeManagerInterfaceFactory } from "./PassCodeManager.did";
export type { _SERVICE as PositionIndex } from "./Position";
export { idlFactory as PositionIndexInterfaceFactory } from "./Position.did";
export type { _SERVICE as SwapNFT, TokenMetadata as SwapNFTTokenMetadata } from "./SwapNFT";
export { idlFactory as SwapNFTInterfaceFactory } from "./SwapNFT.did";
export type {
  _SERVICE as SwapPool,
  Action as FailedTransactionAction,
  AddLimitOrderInfo,
  AddLiquidityInfo,
  ClaimArgs,
  ClaimInfo,
  DecreaseLiquidityArgs,
  DecreaseLiquidityInfo,
  DepositAndSwapArgs,
  DepositInfo,
  ExecuteLimitOrderInfo,
  IncreaseLiquidityArgs,
  LimitOrderKey,
  LimitOrderValue,
  MintArgs,
  OneStepSwapInfo,
  PoolMetadata,
  PositionInfoWithId,
  RefundInfo,
  RemoveLimitOrderInfo,
  SwapArgs,
  SwapInfo,
  TickInfoWithId,
  TickLiquidityInfo,
  Transaction as SwapFailedTransaction,
  TransferPositionInfo,
  UserPositionInfo,
  UserPositionInfoWithId,
  UserPositionInfoWithTokenAmount,
  UserWithdrawQueueInfo,
  WithdrawInfo,
} from "./SwapPool";
export { idlFactory as SwapPoolInterfaceFactory } from "./SwapPool.did";
export type { _SERVICE as TICKET_SERVICE, Ticket } from "./Ticket";
export { idlFactory as TicketInterfaceFactory } from "./Ticket.did";

export type PassCodeResult = Array<[Principal, Array<PassCode>]>;
export type { PassCode };
