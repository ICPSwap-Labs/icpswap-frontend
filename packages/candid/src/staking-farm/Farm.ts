import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface CycleInfo {
  balance: bigint;
  available: bigint;
}
export interface Deposit {
  tickUpper: bigint;
  rewardAmount: bigint;
  owner: Principal;
  liquidity: bigint;
  initTime: bigint;
  lastDistributeTime: bigint;
  positionId: bigint;
  token0Amount: bigint;
  holder: Principal;
  token1Amount: bigint;
  tickLower: bigint;
}
export interface DistributeRecord {
  rewardTotal: bigint;
  owner: Principal;
  positionId: bigint;
  timestamp: bigint;
  rewardGained: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export interface FarmInfo {
  startTime: bigint;
  status: FarmStatus;
  creator: Principal;
  totalRewardHarvested: bigint;
  numberOfStakes: bigint;
  rewardToken: Token;
  endTime: bigint;
  totalRewardBalance: bigint;
  pool: Principal;
  refunder: Principal;
  poolToken0: Token;
  poolToken1: Token;
  poolFee: bigint;
  totalRewardUnharvested: bigint;
  totalReward: bigint;
  userNumberOfStakes: bigint;
  positionIds: Array<bigint>;
}
export type FarmStatus = { LIVE: null } | { NOT_STARTED: null } | { CLOSED: null } | { FINISHED: null };
export interface InitFarmArgs {
  fee: bigint;
  startTime: bigint;
  status: FarmStatus;
  secondPerCycle: bigint;
  creator: Principal;
  farmIndexCid: Principal;
  rewardToken: Token;
  endTime: bigint;
  pool: Principal;
  refunder: Principal;
  governanceCid: [] | [Principal];
  priceInsideLimit: boolean;
  token0AmountLimit: bigint;
  token1AmountLimit: bigint;
  totalReward: bigint;
  farmFactoryCid: Principal;
  feeReceiverCid: Principal;
}
export interface Page {
  content: Array<[Principal, bigint]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<StakeRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_2 {
  content: Array<DistributeRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: string } | { err: Error };
export type Result_1 = { ok: bigint } | { err: Error };
export type Result_10 =
  | {
      ok: {
        poolToken0Symbol: string;
        poolToken1Symbol: string;
        poolToken1Decimals: bigint;
        poolToken0Decimals: bigint;
        poolToken0: { address: string; standard: string };
        poolToken1: { address: string; standard: string };
      };
    }
  | { err: Error };
export type Result_11 =
  | {
      ok: {
        poolToken0Amount: bigint;
        totalLiquidity: bigint;
        poolToken1Amount: bigint;
      };
    }
  | { err: Error };
export type Result_12 =
  | {
      ok: {
        priceInsideLimit: boolean;
        positionNumLimit: bigint;
        token0AmountLimit: bigint;
        token1AmountLimit: bigint;
      };
    }
  | { err: Error };
export type Result_13 = { ok: InitFarmArgs } | { err: Error };
export type Result_14 = { ok: FarmInfo } | { err: Error };
export type Result_15 = { ok: Page_2 } | { err: string };
export type Result_16 = { ok: Deposit } | { err: Error };
export type Result_17 = { ok: CycleInfo } | { err: Error };
export type Result_18 = { ok: Array<Principal> } | { err: Error };
export type Result_2 =
  | {
      ok: { poolToken0: TokenAmount; poolToken1: TokenAmount };
    }
  | { err: Error };
export type Result_3 = { ok: Page } | { err: Error };
export type Result_4 = { ok: Array<Deposit> } | { err: Error };
export type Result_5 = { ok: Array<TransferLog> } | { err: Error };
export type Result_6 = { ok: TVL } | { err: Error };
export type Result_7 = { ok: Page_1 } | { err: string };
export type Result_8 =
  | {
      ok: {
        secondPerCycle: bigint;
        totalRewardHarvested: bigint;
        totalRewardBalance: bigint;
        totalRewardFee: bigint;
        rewardPerCycle: bigint;
        rewardTokenFee: bigint;
        totalCycleCount: bigint;
        totalRewardUnharvested: bigint;
        currentCycleCount: bigint;
        totalReward: bigint;
      };
    }
  | { err: Error };
export type Result_9 = { ok: Array<bigint> } | { err: Error };
export interface StakeRecord {
  to: Principal;
  transType: TransType;
  from: Principal;
  liquidity: bigint;
  positionId: bigint;
  timestamp: bigint;
  amount: bigint;
}
export interface TVL {
  poolToken0: TokenAmount;
  poolToken1: TokenAmount;
}
export interface Token {
  address: string;
  standard: string;
}
export interface TokenAmount {
  address: string;
  amount: bigint;
  standard: string;
}
export type TransType =
  | { withdraw: null }
  | { distribute: null }
  | { unstake: null }
  | { stake: null }
  | { harvest: null };
export interface TransferLog {
  to: Principal;
  fee: bigint;
  result: string;
  token: Token;
  action: string;
  daysFrom19700101: bigint;
  owner: Principal;
  from: Principal;
  fromSubaccount: [] | [Uint8Array | number[]];
  timestamp: bigint;
  index: bigint;
  amount: bigint;
  errorMsg: string;
}
export interface _SERVICE {
  clearErrorLog: ActorMethod<[], undefined>;
  close: ActorMethod<[], Result>;
  finishManually: ActorMethod<[], Result>;
  getAdmins: ActorMethod<[], Result_18>;
  getCycleInfo: ActorMethod<[], Result_17>;
  getDeposit: ActorMethod<[bigint], Result_16>;
  getDistributeRecord: ActorMethod<[bigint, bigint, string], Result_15>;
  getErrorLog: ActorMethod<[], Array<string>>;
  getFarmInfo: ActorMethod<[string], Result_14>;
  getInitArgs: ActorMethod<[], Result_13>;
  getLimitInfo: ActorMethod<[], Result_12>;
  getLiquidityInfo: ActorMethod<[], Result_11>;
  getPoolMeta: ActorMethod<[], { sqrtPriceX96: bigint; tick: bigint }>;
  getPoolTokenMeta: ActorMethod<[], Result_10>;
  getPositionIds: ActorMethod<[], Result_9>;
  getRewardInfo: ActorMethod<[Array<bigint>], Result_1>;
  getRewardMeta: ActorMethod<[], Result_8>;
  getRewardTokenBalance: ActorMethod<[], bigint>;
  getStakeRecord: ActorMethod<[bigint, bigint, string], Result_7>;
  getTVL: ActorMethod<[], Result_6>;
  getTransferLogs: ActorMethod<[], Result_5>;
  getUserDeposits: ActorMethod<[Principal], Result_4>;
  getUserRewardBalance: ActorMethod<[Principal], Result_1>;
  getUserRewardBalances: ActorMethod<[bigint, bigint], Result_3>;
  getUserTVL: ActorMethod<[Principal], Result_2>;
  getVersion: ActorMethod<[], string>;
  init: ActorMethod<[], undefined>;
  removeErrorTransferLog: ActorMethod<[bigint, boolean], undefined>;
  restartManually: ActorMethod<[], Result>;
  sendRewardManually: ActorMethod<[], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setLimitInfo: ActorMethod<[bigint, bigint, bigint, boolean], undefined>;
  stake: ActorMethod<[bigint], Result>;
  unstake: ActorMethod<[bigint], Result>;
  withdraw: ActorMethod<[], Result_1>;
  withdrawRewardFee: ActorMethod<[], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
