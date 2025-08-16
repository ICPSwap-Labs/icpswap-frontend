import { Principal } from "@dfinity/principal";
import type { Passcode as PassCode } from "./Factory";

export { idlFactory as PositionIndexInterfaceFactory } from "./Position.did";
export type { _SERVICE as PositionIndex } from "./Position";

export { idlFactory as SwapFactoryInterfaceFactory } from "./Factory.did";
export type {
  _SERVICE as SwapFactory,
  GetPoolArgs,
  CreatePoolArgs,
  PoolData as SwapPoolData,
  Token as SwapPoolToken,
  PoolInstaller,
} from "./Factory";

export { idlFactory as SwapNFTInterfaceFactory } from "./SwapNFT.did";
export type { _SERVICE as SwapNFT, TokenMetadata as SwapNFTTokenMetadata } from "./SwapNFT";

export { idlFactory as SwapPoolInterfaceFactory } from "./SwapPool.did";
export type {
  _SERVICE as SwapPool,
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
  LimitOrderKey,
  LimitOrderValue,
  DepositAndSwapArgs,
  Transaction as SwapFailedTransaction,
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
  Action as FailedTransactionAction,
  AddLiquidityInfo,
} from "./SwapPool";

export { idlFactory as TicketInterfaceFactory } from "./Ticket.did";
export type { _SERVICE as TICKET_SERVICE, Ticket } from "./Ticket";

export type { _SERVICE as PassCodeManagerService } from "./PassCodeManager";
export { idlFactory as PassCodeManagerInterfaceFactory } from "./PassCodeManager.did";

export type {
  _SERVICE as LimitTransactionService,
  LimitOrder as LimitTransaction,
  QueryResult as LimitTransactionResult,
} from "./LimitTransaction";
export { idlFactory as LimitTransactionInterfaceFactory } from "./LimitTransaction.did";

export type PassCodeResult = Array<[Principal, Array<PassCode>]>;
export type { PassCode };
