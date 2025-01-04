import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface CallbackStrategy {
  token: Token;
  callback: [Principal, string];
}
export type HeaderField = [string, string];
export interface HttpRequest {
  url: string;
  method: string;
  body: Uint8Array | number[];
  headers: Array<HeaderField>;
}
export interface HttpResponse {
  body: Uint8Array | number[];
  headers: Array<HeaderField>;
  upgrade: [] | [boolean];
  streaming_strategy: [] | [StreamingStrategy];
  status_code: number;
}
export type NatResult = { ok: bigint } | { err: string };
export interface PoolBaseInfo {
  fee: bigint;
  token0Id: string;
  token1Id: string;
  pool: string;
  token1Standard: string;
  token1Decimals: number;
  token0Standard: string;
  token0Symbol: string;
  token0Decimals: number;
  token1Symbol: string;
}
export interface PoolTvlData {
  token0Id: string;
  token1Id: string;
  pool: string;
  tvlUSD: number;
  token0Symbol: string;
  token1Symbol: string;
}
export interface StreamingCallbackHttpResponse {
  token: [] | [Token];
  body: Uint8Array | number[];
}
export type StreamingStrategy = { Callback: CallbackStrategy };
export interface SwapErrorInfo {
  data: SwapRecordInfo;
  error: string;
  timestamp: bigint;
}
export interface SwapRecordInfo {
  to: string;
  feeAmount: bigint;
  action: TransactionType;
  feeAmountTotal: bigint;
  token0Id: string;
  token1Id: string;
  token0AmountTotal: bigint;
  liquidityTotal: bigint;
  from: string;
  tick: bigint;
  feeTire: bigint;
  recipient: string;
  token0ChangeAmount: bigint;
  token1AmountTotal: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export interface SwapRecordInfo__1 {
  to: string;
  feeAmount: bigint;
  action: TransactionType;
  feeAmountTotal: bigint;
  token0Id: string;
  token1Id: string;
  token0AmountTotal: bigint;
  liquidityTotal: bigint;
  from: string;
  tick: bigint;
  feeTire: bigint;
  recipient: string;
  token0ChangeAmount: bigint;
  token1AmountTotal: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export interface Token {
  arbitrary_data: string;
}
export interface TokenPrice {
  tokenId: string;
  volumeUSD7d: number;
  priceICP: number;
  priceUSD: number;
}
export type TransactionType =
  | { decreaseLiquidity: null }
  | {
      limitOrder: {
        token0InAmount: bigint;
        positionId: bigint;
        tickLimit: bigint;
        token1InAmount: bigint;
      };
    }
  | { claim: null }
  | { swap: null }
  | { addLiquidity: null }
  | { transferPosition: bigint }
  | { increaseLiquidity: null };
export interface _SERVICE {
  addClient: ActorMethod<[Principal], undefined>;
  baseLastStorage: ActorMethod<[], string>;
  baseStorage: ActorMethod<[], Array<string>>;
  batchPush: ActorMethod<[Array<SwapRecordInfo__1>], undefined>;
  batchUpdatePoolTvl: ActorMethod<[Array<PoolTvlData>], undefined>;
  batchUpdateTokenPrice7dVolumeUSD: ActorMethod<[Array<[string, number]>], undefined>;
  cleanErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getAllPools: ActorMethod<[], Array<PoolBaseInfo>>;
  getAllowTokens: ActorMethod<[], Array<string>>;
  getClients: ActorMethod<[], Array<Principal>>;
  getControllers: ActorMethod<[], Array<Principal>>;
  getDataQueue: ActorMethod<[], Array<SwapRecordInfo__1>>;
  getErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  getPoolLastPrice: ActorMethod<[Principal], number>;
  getPoolLastPriceTime: ActorMethod<[], Array<[string, bigint]>>;
  getPoolTvl: ActorMethod<[], Array<PoolTvlData>>;
  getQuoteTokens: ActorMethod<[], Array<string>>;
  getStorageCount: ActorMethod<[], [Array<[string, bigint]>, bigint]>;
  getSyncError: ActorMethod<[], string>;
  getSyncLock: ActorMethod<[], boolean>;
  getTokenPriceMetadata: ActorMethod<[], Array<[string, TokenPrice]>>;
  getTransferPositionStorageCount: ActorMethod<[], [Array<[string, bigint]>, bigint]>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  push: ActorMethod<[SwapRecordInfo__1], undefined>;
  removeTokenMetadata: ActorMethod<[Principal], undefined>;
  retryErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  setQuoteTokens: ActorMethod<[Array<string>, boolean], undefined>;
  transferPositionLastStorage: ActorMethod<[], string>;
  transferPositionStorage: ActorMethod<[], Array<string>>;
  updateMiniProportion: ActorMethod<[number], undefined>;
  updateTokenMetadata: ActorMethod<[Principal, string, bigint], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
