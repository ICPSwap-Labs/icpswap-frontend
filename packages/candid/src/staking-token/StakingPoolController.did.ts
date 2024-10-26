export const idlFactory = ({ IDL }: any) => {
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const InitRequest = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    name: IDL.Text,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_11 = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
  const Result_2 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const TokenGlobalDataInfo = IDL.Record({
    rewardAmount: IDL.Float64,
    stakingAmount: IDL.Float64,
    rewardTokenPrice: IDL.Float64,
    rewardTokenCanisterId: IDL.Text,
    stakingTokenCanisterId: IDL.Text,
    stakingTokenPrice: IDL.Float64,
    stakingTokenAmount: IDL.Nat,
    rewardTokenAmount: IDL.Nat,
  });
  const Result_10 = IDL.Variant({
    ok: IDL.Vec(TokenGlobalDataInfo),
    err: IDL.Text,
  });
  const StakingPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Principal,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    name: IDL.Text,
    createTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    canisterId: IDL.Principal,
  });
  const Page = IDL.Record({
    content: IDL.Vec(StakingPoolInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_9 = IDL.Variant({ ok: Page, err: Page });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_8 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_7 = IDL.Variant({ ok: CycleInfo, err: Error });
  const GlobalDataInfo = IDL.Record({
    valueOfStaking: IDL.Float64,
    valueOfRewarded: IDL.Float64,
    totalStaker: IDL.Nat,
    valueOfRewardsInProgress: IDL.Float64,
    totalPools: IDL.Nat,
  });
  const Result_6 = IDL.Variant({ ok: GlobalDataInfo, err: IDL.Text });
  const Result_5 = IDL.Variant({
    ok: IDL.Record({
      governanceCid: IDL.Opt(IDL.Principal),
      userIndexCid: IDL.Principal,
      feeReceiverCid: IDL.Principal,
    }),
    err: Error,
  });
  const Result_4 = IDL.Variant({
    ok: IDL.Tuple(IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Bool),
    err: IDL.Text,
  });
  const Result_3 = IDL.Variant({
    ok: TokenGlobalDataInfo,
    err: IDL.Text,
  });
  const Result_1 = IDL.Variant({ ok: StakingPoolInfo, err: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  return IDL.Service({
    addStakingPoolControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    createStakingPool: IDL.Func([InitRequest], [Result_11], []),
    deleteStakingPool: IDL.Func([IDL.Principal], [Result_2], []),
    findPoolStatInfo: IDL.Func([], [Result_10], ["query"]),
    findStakingPoolPage: IDL.Func([IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [Result_9], ["query"]),
    findStakingPoolPageV2: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [Result_9],
      ["query"],
    ),
    getAdmins: IDL.Func([], [Result_8], ["query"]),
    getCycleInfo: IDL.Func([], [Result_7], []),
    getGlobalData: IDL.Func([], [Result_6], ["query"]),
    getInitArgs: IDL.Func([], [Result_5], ["query"]),
    getOperationInfo: IDL.Func([], [Result_4], ["query"]),
    getPoolStatInfo: IDL.Func([IDL.Principal], [Result_3], ["query"]),
    getStakingPool: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    removeStakingPoolControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setRewardFee: IDL.Func([IDL.Nat], [Result_2], []),
    setStakingPoolAdmins: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setStakingPoolTime: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [Result_1], []),
    setUpdateGlobalDataState: IDL.Func([IDL.Bool], [Result_2], []),
    setUserIndexCanister: IDL.Func([IDL.Principal], [Result_2], []),
    stopStakingPool: IDL.Func([IDL.Principal], [Result_1], []),
    stopTimer: IDL.Func([], [], []),
    unclaimdRewardFee: IDL.Func([IDL.Principal], [Result], []),
  });
};
