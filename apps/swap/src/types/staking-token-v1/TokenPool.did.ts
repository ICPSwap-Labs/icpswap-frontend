export const idlFactory = ({ IDL }: any) => {
  const Result_2 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const Result_10 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const ChangeTokenPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    lastRewardTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    rewardTokenFeeMultiplier: IDL.Nat,
    bonusEndTime: IDL.Nat,
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    stakingTokenFeeMultiplier: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const PublicUserInfo = IDL.Record({
    pendingReward: IDL.Nat,
    rewardDebt: IDL.Nat,
    amount: IDL.Nat,
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Text, PublicUserInfo)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_14 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const Result_6 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const Result_13 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    err: IDL.Text,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_5 = IDL.Variant({ ok: CycleInfo, err: Error });
  const PublicTokenPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    lastRewardTime: IDL.Nat,
    totalDeposit: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardDebt: IDL.Nat,
    storageCid: IDL.Text,
    rewardTokenFee: IDL.Nat,
    accPerShare: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    rewardTokenFeeMultiplier: IDL.Nat,
    bonusEndTime: IDL.Nat,
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    allocPoint: IDL.Nat,
    stakingTokenFeeMultiplier: IDL.Nat,
  });
  const Result_11 = IDL.Variant({
    ok: PublicTokenPoolInfo,
    err: IDL.Text,
  });
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: IDL.Text,
  });
  const Result_12 = IDL.Variant({ ok: PublicUserInfo, err: IDL.Text });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [Result_2], []),
    balanceTo: IDL.Func([IDL.Principal], [Result_10], []),
    changePoolInfo: IDL.Func([ChangeTokenPoolInfo], [Result_2], []),
    claim: IDL.Func([], [Result_1], []),
    claimTo: IDL.Func([], [Result_1], []),
    clearLocksMap: IDL.Func([], [Result_10], []),
    deposit: IDL.Func([], [Result_1], []),
    depositFrom: IDL.Func([IDL.Nat], [Result_1], []),
    endTokenPoolStaking: IDL.Func([], [Result_10], []),
    findAllUserInfo: IDL.Func([IDL.Nat, IDL.Nat], [Result_14], ["query"]),
    getAdminList: IDL.Func([], [Result_6], ["query"]),
    getAllLocks: IDL.Func([], [Result_13], ["query"]),
    getCycleInfo: IDL.Func([], [Result_5], []),
    getPoolInfo: IDL.Func([], [Result_11], ["query"]),
    getUserInfo: IDL.Func([User], [Result_12], ["query"]),
    harvest: IDL.Func([], [Result_10], []),
    pendingReward: IDL.Func([User], [Result_10], ["query"]),
    registerTask: IDL.Func([], [Result_2], []),
    removeAdmin: IDL.Func([IDL.Text], [Result_2], []),
    resetReward: IDL.Func([IDL.Nat, IDL.Nat], [Result_11], []),
    setAutoUnlockTimes: IDL.Func([IDL.Nat], [Result_10], []),
    setTaskState: IDL.Func([IDL.Bool], [Result_2], []),
    setTokenPoolController: IDL.Func([IDL.Text], [Result_2], []),
    stopReward: IDL.Func([], [Result_11], []),
    task: IDL.Func([IDL.Text], [], []),
    updateMultiplier: IDL.Func([IDL.Nat], [Result_11], []),
    withdraw: IDL.Func([IDL.Nat], [Result_1], []),
    withdrawTokenTo: IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Principal], [Result_10], []),
  });
};
