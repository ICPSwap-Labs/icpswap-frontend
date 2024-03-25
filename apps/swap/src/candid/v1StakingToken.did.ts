import type { Principal } from "@dfinity/principal";

export type AccountIdentifier = string;
export interface ChangePoolInfo {
  stakingTokenSymbol: string;
  lastRewardTime: bigint;
  rewardTokenSymbol: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  rewardPerTime: bigint;
  rewardStandard: string;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
}
export interface InitRequest {
  stakingTokenSymbol: string;
  startTime: bigint;
  rewardTokenSymbol: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  rewardPerTime: bigint;
  name: string;
  rewardStandard: string;
  stakingTokenFee: bigint;
  rewardTokenFee: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
}
export interface PublicPoolInfo {
  stakingTokenSymbol: string;
  storageCanisterId: string;
  lastRewardTime: bigint;
  totalDeposit: bigint;
  rewardTokenSymbol: string;
  stakingToken: string;
  rewardToken: string;
  stakingStandard: string;
  rewardPerTime: bigint;
  rewardStandard: string;
  stakingTokenFee: bigint;
  rewardDebt: bigint;
  rewardTokenFee: bigint;
  accPerShare: bigint;
  stakingTokenDecimals: bigint;
  bonusEndTime: bigint;
  BONUS_MULTIPLIER: bigint;
  rewardTokenDecimals: bigint;
  allocPoint: bigint;
}
export interface PublicUserInfo {
  pendingReward: bigint;
  rewardDebt: bigint;
  amount: bigint;
}
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: boolean } | { err: string };
export type Result_2 = { ok: bigint } | { err: string };
export type Result_3 = { ok: PublicUserInfo } | { err: string };
export type Result_4 = { ok: PublicPoolInfo } | { err: string };
export type Result_5 = { ok: Array<string> } | { err: string };
export interface SingleSmartChef {
  addAdmin: (arg_0: string) => Promise<Result_1>;
  changePoolInfo: (arg_0: ChangePoolInfo) => Promise<undefined>;
  cycleAvailable: () => Promise<bigint>;
  cycleBalance: () => Promise<bigint>;
  deposit: (arg_0: bigint) => Promise<Result>;
  endSingleSmartChefCanister: () => Promise<undefined>;
  getAdminList: () => Promise<Result_5>;
  getAllUserInfoEntries: () => Promise<string>;
  getPoolInfo: () => Promise<Result_4>;
  getStorageChanisterId: () => Promise<string>;
  getUserInfo: (arg_0: User) => Promise<Result_3>;
  harvest: () => Promise<Result_2>;
  pendingReward: (arg_0: User) => Promise<Result_2>;
  removeAdmin: (arg_0: string) => Promise<Result_1>;
  resetReward: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
  stopReward: () => Promise<undefined>;
  updateMultiplier: (arg_0: bigint) => Promise<undefined>;
  updatePool: () => Promise<undefined>;
  withdraw: (arg_0: bigint) => Promise<Result>;
}
export type User = { principal: Principal } | { address: AccountIdentifier };
export type _SERVICE = SingleSmartChef

export const idlFactory = ({ IDL }: any) => {
  const InitRequest = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    rewardPerTime: IDL.Nat,
    name: IDL.Text,
    rewardStandard: IDL.Text,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const ChangePoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    lastRewardTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    rewardPerTime: IDL.Nat,
    rewardStandard: IDL.Text,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result_5 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const PublicPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    storageCanisterId: IDL.Text,
    lastRewardTime: IDL.Nat,
    totalDeposit: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    rewardPerTime: IDL.Nat,
    rewardStandard: IDL.Text,
    stakingTokenFee: IDL.Nat,
    rewardDebt: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    accPerShare: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    allocPoint: IDL.Nat,
  });
  const Result_4 = IDL.Variant({ ok: PublicPoolInfo, err: IDL.Text });
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier,
  });
  const PublicUserInfo = IDL.Record({
    pendingReward: IDL.Nat,
    rewardDebt: IDL.Nat,
    amount: IDL.Nat,
  });
  const Result_3 = IDL.Variant({ ok: PublicUserInfo, err: IDL.Text });
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const SingleSmartChef = IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [Result_1], []),
    changePoolInfo: IDL.Func([ChangePoolInfo], [], []),
    cycleAvailable: IDL.Func([], [IDL.Nat], []),
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    deposit: IDL.Func([IDL.Nat], [Result], []),
    endSingleSmartChefCanister: IDL.Func([], [], []),
    getAdminList: IDL.Func([], [Result_5], ["query"]),
    getAllUserInfoEntries: IDL.Func([], [IDL.Text], []),
    getPoolInfo: IDL.Func([], [Result_4], ["query"]),
    getStorageChanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getUserInfo: IDL.Func([User], [Result_3], ["query"]),
    harvest: IDL.Func([], [Result_2], []),
    pendingReward: IDL.Func([User], [Result_2], ["query"]),
    removeAdmin: IDL.Func([IDL.Text], [Result_1], []),
    resetReward: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    stopReward: IDL.Func([], [], []),
    updateMultiplier: IDL.Func([IDL.Nat], [], []),
    updatePool: IDL.Func([], [], []),
    withdraw: IDL.Func([IDL.Nat], [Result], []),
  });
  return SingleSmartChef;
};
