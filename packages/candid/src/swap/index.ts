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
} from "./SwapPool";

export { idlFactory as TicketInterfaceFactory } from "./Ticket.did";
export type { _SERVICE as TICKET_SERVICE, Ticket } from "./Ticket";

export type { _SERVICE as PassCodeManagerService } from "./PassCodeManager";
export { idlFactory as PassCodeManagerInterfaceFactory } from "./PassCodeManager.did";

export type PassCodeResult = Array<[Principal, Array<PassCode>]>;
export type { PassCode };

export type {
  _SERVICE as PositionChartsService,
  PriceIndex as PositionPricePeriodRange,
  PoolAprIndex as PositionAPRs,
} from "./PositionCharts";
export { idlFactory as PositionChartsFactory } from "./PositionCharts.did";
