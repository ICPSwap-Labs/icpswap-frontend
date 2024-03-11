export const idlFactory = ({ IDL }: any) => {
  const Result_3 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
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
    rewardTokenDecimals: IDL.Nat
  });
  const Ledger = IDL.Record({
    staking: IDL.Float64,
    claim: IDL.Float64,
    stakingBalance: IDL.Float64,
    unStaking: IDL.Float64,
    rewardBalance: IDL.Float64
  });
  const Result_2 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result_7 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
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
    allocPoint: IDL.Nat
  });
  const Result_6 = IDL.Variant({ ok: PublicPoolInfo, err: IDL.Text });
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const PublicUserInfo = IDL.Record({
    pendingReward: IDL.Nat,
    rewardDebt: IDL.Nat,
    amount: IDL.Nat
  });
  const Result_5 = IDL.Variant({ ok: PublicUserInfo, err: IDL.Text });
  const Result_4 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [Result_3], []),
    changePoolInfo: IDL.Func([ChangePoolInfo], [], []),
    clearLocksMap: IDL.Func([], [], []),
    compareLedger: IDL.Func([], [Ledger], []),
    cycleAvailable: IDL.Func([], [IDL.Nat], ["query"]),
    cycleBalance: IDL.Func([], [IDL.Nat], ["query"]),
    deposit: IDL.Func([IDL.Nat], [Result_2], []),
    endSingleSmartChefCanister: IDL.Func([], [], []),
    getAdminList: IDL.Func([], [Result_7], ["query"]),
    getAllLocks: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], []),
    getAllUserInfoEntries: IDL.Func([], [IDL.Text], []),
    getPoolInfo: IDL.Func([], [Result_6], ["query"]),
    getUserInfo: IDL.Func([User], [Result_5], ["query"]),
    harvest: IDL.Func([], [Result_4], []),
    initLedger: IDL.Func([], [], []),
    pendingReward: IDL.Func([User], [Result_4], ["query"]),
    removeAdmin: IDL.Func([IDL.Text], [Result_3], []),
    resetReward: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    setInitLedger: IDL.Func([Ledger], [Ledger], []),
    stopReward: IDL.Func([], [], []),
    updateMultiplier: IDL.Func([IDL.Nat], [], []),
    updatePool: IDL.Func([], [], []),
    withdraw: IDL.Func([IDL.Nat], [Result_2], [])
  });
};
