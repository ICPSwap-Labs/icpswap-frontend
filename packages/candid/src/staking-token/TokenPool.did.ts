export const idlFactory = ({ IDL }: any) => {
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PublicUserInfo = IDL.Record({
    pendingReward: IDL.Nat,
    rewardDebt: IDL.Nat,
    amount: IDL.Nat,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, PublicUserInfo)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_9 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const TransType = IDL.Variant({
    unstake: IDL.Null,
    stake: IDL.Null,
    harvest: IDL.Null,
  });
  const Record = IDL.Record({
    to: IDL.Principal,
    stakingTokenSymbol: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    transType: TransType,
    from: IDL.Principal,
    rewardStandard: IDL.Text,
    timestamp: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    amount: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Page = IDL.Record({
    content: IDL.Vec(Record),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_8 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_7 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const Result_6 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    err: IDL.Text,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_5 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const PublicStakingPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    lastRewardTime: IDL.Nat,
    totalDeposit: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardFee: IDL.Nat,
    rewardDebt: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    accPerShare: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_3 = IDL.Variant({
    ok: PublicStakingPoolInfo,
    err: IDL.Text,
  });
  const Result_4 = IDL.Variant({ ok: PublicUserInfo, err: IDL.Text });
  const UpdateStakingPool = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  return IDL.Service({
    claim: IDL.Func([], [Result], []),
    clearLocks: IDL.Func([], [Result_1], []),
    findAllUserInfo: IDL.Func([IDL.Nat, IDL.Nat], [Result_9], ["query"]),
    findRewardRecordPage: IDL.Func([IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat], [Result_8], ["query"]),
    findStakingRecordPage: IDL.Func([IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat], [Result_8], ["query"]),
    getAdmins: IDL.Func([], [Result_7], ["query"]),
    getAllLocks: IDL.Func([], [Result_6], ["query"]),
    getCycleInfo: IDL.Func([], [Result_5], []),
    getPoolInfo: IDL.Func([], [Result_3], ["query"]),
    getUserInfo: IDL.Func([IDL.Principal], [Result_4], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    harvest: IDL.Func([], [Result_1], []),
    pendingReward: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    refundSubaccountBalance: IDL.Func([IDL.Principal], [Result], []),
    refundUserStaking: IDL.Func([IDL.Principal], [Result], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setAutoUnlockTimes: IDL.Func([IDL.Nat], [Result_1], []),
    setTime: IDL.Func([IDL.Nat, IDL.Nat], [Result_3], []),
    stake: IDL.Func([], [Result], []),
    stakeFrom: IDL.Func([IDL.Nat], [Result], []),
    stop: IDL.Func([], [Result_3], []),
    subaccountBalanceOf: IDL.Func([IDL.Principal], [Result_1], []),
    unclaimdRewardFee: IDL.Func([], [Result_1], ["query"]),
    unstake: IDL.Func([IDL.Nat], [Result], []),
    updateStakingPool: IDL.Func([UpdateStakingPool], [Result_2], []),
    withdrawRemainingRewardToken: IDL.Func([IDL.Nat, IDL.Principal], [Result_1], []),
    withdrawRewardFee: IDL.Func([], [Result], []),
  });
};
