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
  ICP: Token;
  fee: bigint;
  startTime: bigint;
  status: FarmStatus;
  secondPerCycle: bigint;
  farmControllerCid: Principal;
  creator: Principal;
  rewardToken: Token;
  endTime: bigint;
  pool: Principal;
  refunder: Principal;
  priceInsideLimit: boolean;
  token0AmountLimit: bigint;
  rewardPool: Principal;
  token1AmountLimit: bigint;
  totalReward: bigint;
  feeReceiverCid: Principal;
}
export interface Page {
  content: Array<StakeRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<DistributeRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result_10 = { ok: Array<Deposit> } | { err: Error };
export type Result_11 =
  | {
      ok: { stakedTokenTVL: number; rewardTokenTVL: number };
    }
  | { err: Error };
export type Result_12 = { ok: Page } | { err: string };
export type Result_13 =
  | {
      ok: {
        secondPerCycle: bigint;
        totalRewardHarvested: bigint;
        totalRewardBalance: bigint;
        totalRewardFee: bigint;
        rewardPerCycle: bigint;
        totalCycleCount: bigint;
        totalRewardUnharvested: bigint;
        currentCycleCount: bigint;
        totalReward: bigint;
      };
    }
  | { err: Error };
export type Result_14 = { ok: Array<bigint> } | { err: Error };
export type Result_15 =
  | {
      ok: {
        poolToken0Amount: bigint;
        totalLiquidity: bigint;
        poolToken1Amount: bigint;
      };
    }
  | { err: Error };
export type Result_16 =
  | {
      ok: {
        priceInsideLimit: boolean;
        positionNumLimit: bigint;
        token0AmountLimit: bigint;
        token1AmountLimit: bigint;
      };
    }
  | { err: Error };
export type Result_17 = { ok: InitFarmArgs } | { err: Error };
export type Result_18 = { ok: FarmInfo } | { err: Error };
export type Result_19 = { ok: Page_1 } | { err: string };
export type Result_2 = { ok: bigint } | { err: Error };
export type Result_20 = { ok: Deposit } | { err: Error };
export type Result_4 = { ok: CycleInfo } | { err: Error };
export type Result_6 = { ok: Array<Principal> } | { err: Error };
export type Result_8 = { ok: string } | { err: Error };
export type Result_9 = { ok: number } | { err: Error };
export interface StakeRecord {
  to: Principal;
  transType: TransType;
  from: Principal;
  liquidity: bigint;
  positionId: bigint;
  timestamp: bigint;
  amount: bigint;
}
export interface Token {
  address: string;
  standard: string;
}
export type TransType =
  | { withdraw: null }
  | { distribute: null }
  | { unstake: null }
  | { stake: null }
  | { harvest: null };
export interface _SERVICE {
  clearErrorLog: ActorMethod<[], undefined>;
  close: ActorMethod<[], Result_8>;
  finishManually: ActorMethod<[], Result_8>;
  getAdmins: ActorMethod<[], Result_6>;
  getCycleInfo: ActorMethod<[], Result_4>;
  getDeposit: ActorMethod<[bigint], Result_20>;
  getDistributeRecord: ActorMethod<[bigint, bigint, string], Result_19>;
  getErrorLog: ActorMethod<[], Array<string>>;
  getFarmInfo: ActorMethod<[string], Result_18>;
  getInitArgs: ActorMethod<[], Result_17>;
  getLimitInfo: ActorMethod<[], Result_16>;
  getLiquidityInfo: ActorMethod<[], Result_15>;
  getPoolMeta: ActorMethod<
    [],
    {
      poolMetadata: {
        toICPPrice: number;
        sqrtPriceX96: bigint;
        tick: bigint;
        zeroForOne: boolean;
      };
      rewardPoolMetadata: {
        toICPPrice: number;
        sqrtPriceX96: bigint;
        tick: bigint;
        zeroForOne: boolean;
      };
    }
  >;
  getPositionIds: ActorMethod<[], Result_14>;
  getRewardInfo: ActorMethod<[Array<bigint>], Result_2>;
  getRewardMeta: ActorMethod<[], Result_13>;
  getRewardTokenBalance: ActorMethod<[], bigint>;
  getStakeRecord: ActorMethod<[bigint, bigint, string], Result_12>;
  getTVL: ActorMethod<[], Result_11>;
  getUserDeposits: ActorMethod<[Principal], Result_10>;
  getUserTVL: ActorMethod<[Principal], Result_9>;
  getVersion: ActorMethod<[], string>;
  init: ActorMethod<[], undefined>;
  restartManually: ActorMethod<[], Result_8>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setLimitInfo: ActorMethod<[bigint, bigint, bigint, boolean], undefined>;
  stake: ActorMethod<[bigint], Result_8>;
  unstake: ActorMethod<[bigint], Result_8>;
  withdrawRewardFee: ActorMethod<[], Result_8>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
