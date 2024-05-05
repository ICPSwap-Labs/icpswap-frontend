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
  numberOfStakes: bigint;
  rewardToken: Token;
  endTime: bigint;
  totalRewardBalance: bigint;
  pool: Principal;
  refunder: Principal;
  totalRewardClaimed: bigint;
  poolToken0: Token;
  poolToken1: Token;
  poolFee: bigint;
  totalReward: bigint;
  userNumberOfStakes: bigint;
  totalRewardUnclaimed: bigint;
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
export type Result = { ok: string } | { err: Error };
export type Result_1 = { ok: number } | { err: Error };
export type Result_10 = { ok: InitFarmArgs } | { err: Error };
export type Result_11 = { ok: FarmInfo } | { err: Error };
export type Result_12 = { ok: Page_1 } | { err: string };
export type Result_13 = { ok: Deposit } | { err: Error };
export type Result_14 = { ok: CycleInfo } | { err: Error };
export type Result_15 = { ok: Array<Principal> } | { err: Error };
export type Result_2 = { ok: Array<Deposit> } | { err: Error };
export type Result_3 =
  | {
      ok: { stakedTokenTVL: number; rewardTokenTVL: number };
    }
  | { err: Error };
export type Result_4 = { ok: Page } | { err: string };
export type Result_5 =
  | {
      ok: {
        secondPerCycle: bigint;
        totalRewardBalance: bigint;
        totalRewardFee: bigint;
        rewardPerCycle: bigint;
        totalRewardClaimed: bigint;
        totalCycleCount: bigint;
        currentCycleCount: bigint;
        totalReward: bigint;
        totalRewardUnclaimed: bigint;
      };
    }
  | { err: Error };
export type Result_6 = { ok: bigint } | { err: Error };
export type Result_7 = { ok: Array<bigint> } | { err: Error };
export type Result_8 =
  | {
      ok: {
        poolToken0Amount: bigint;
        totalLiquidity: bigint;
        poolToken1Amount: bigint;
      };
    }
  | { err: Error };
export type Result_9 =
  | {
      ok: {
        priceInsideLimit: boolean;
        positionNumLimit: bigint;
        token0AmountLimit: bigint;
        token1AmountLimit: bigint;
      };
    }
  | { err: Error };
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
  | { claim: null }
  | { distribute: null }
  | { unstake: null }
  | { stake: null };
export interface _SERVICE {
  clearErrorLog: ActorMethod<[], undefined>;
  close: ActorMethod<[], Result>;
  finishManually: ActorMethod<[], Result>;
  getAdmins: ActorMethod<[], Result_15>;
  getCycleInfo: ActorMethod<[], Result_14>;
  getDeposit: ActorMethod<[bigint], Result_13>;
  getDistributeRecord: ActorMethod<[bigint, bigint, string], Result_12>;
  getErrorLog: ActorMethod<[], Array<string>>;
  getFarmInfo: ActorMethod<[string], Result_11>;
  getInitArgs: ActorMethod<[], Result_10>;
  getLimitInfo: ActorMethod<[], Result_9>;
  getLiquidityInfo: ActorMethod<[], Result_8>;
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
  getPositionIds: ActorMethod<[], Result_7>;
  getRewardInfo: ActorMethod<[Array<bigint>], Result_6>;
  getRewardMeta: ActorMethod<[], Result_5>;
  getRewardTokenBalance: ActorMethod<[], bigint>;
  getStakeRecord: ActorMethod<[bigint, bigint, string], Result_4>;
  getTVL: ActorMethod<[], Result_3>;
  getUserDeposits: ActorMethod<[Principal], Result_2>;
  getUserTVL: ActorMethod<[Principal], Result_1>;
  getVersion: ActorMethod<[], string>;
  init: ActorMethod<[], undefined>;
  restartManually: ActorMethod<[], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setLimitInfo: ActorMethod<[bigint, bigint, bigint, boolean], undefined>;
  stake: ActorMethod<[bigint], Result>;
  unstake: ActorMethod<[bigint], Result>;
  withdrawRewardFee: ActorMethod<[], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
