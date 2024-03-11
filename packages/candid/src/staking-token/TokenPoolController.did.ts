export const idlFactory = ({ IDL }: any) => {
  const Result_2 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
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
    BONUS_MULTIPLIER: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const TokenPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Text,
    stakingToken: Token,
    rewardToken: Token,
    name: IDL.Text,
    createTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    version: IDL.Text,
    storageCid: IDL.Text,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    rewardTokenFeeMultiplier: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    stakingTokenFeeMultiplier: IDL.Nat,
    canisterId: IDL.Text,
  });
  const Page = IDL.Record({
    content: IDL.Vec(TokenPoolInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_8 = IDL.Variant({ ok: Page, err: Page });
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
  const Result_7 = IDL.Variant({
    ok: IDL.Vec(TokenGlobalDataInfo),
    err: IDL.Text,
  });
  const Result_6 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_5 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Result = IDL.Variant({ ok: TokenPoolInfo, err: IDL.Text });
  const Result_4 = IDL.Variant({
    ok: TokenGlobalDataInfo,
    err: IDL.Text,
  });
  const GlobalDataInfo = IDL.Record({
    rewardAmount: IDL.Float64,
    stakingAmount: IDL.Float64,
  });
  const Result_3 = IDL.Variant({ ok: GlobalDataInfo, err: IDL.Text });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [Result_2], []),
    createTokenPool: IDL.Func([InitRequest], [Result_1], []),
    deleteTokenPool: IDL.Func([IDL.Principal], [Result_2], []),
    findTokenPoolPage: IDL.Func([IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [Result_8], ["query"]),
    findTokenPoolsGlobalData: IDL.Func([], [Result_7], ["query"]),
    getAdminList: IDL.Func([], [Result_6], ["query"]),
    getCanister: IDL.Func([], [IDL.Record({ icp: Token, scheduleCanister: IDL.Text })], ["query"]),
    getCycleInfo: IDL.Func([], [Result_5], []),
    getPoolInfo: IDL.Func([IDL.Principal], [Result], ["query"]),
    getPoolStatInfo: IDL.Func([IDL.Principal], [Result_4], ["query"]),
    getTokenPoolsGlobalData: IDL.Func([], [Result_3], ["query"]),
    registerTask: IDL.Func([], [Result_2], []),
    removeAdmin: IDL.Func([IDL.Text], [Result_2], []),
    setICP: IDL.Func([Token], [Result_2], []),
    setScheduleCanister: IDL.Func([IDL.Text], [Result_2], []),
    setTaskState: IDL.Func([IDL.Bool], [Result_2], []),
    setTokenPoolAdmin: IDL.Func([IDL.Principal, IDL.Text], [Result_2], []),
    startTokenPool: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [Result], []),
    stopTokenPool: IDL.Func([IDL.Principal], [Result], []),
    syncV1TokenPool: IDL.Func([], [Result_1], []),
    syncV1TokenPoolInfo: IDL.Func([], [Result_1], []),
    task: IDL.Func([IDL.Text], [], []),
    updateMultiplier: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    updateStat: IDL.Func([], [IDL.Bool], []),
  });
};
