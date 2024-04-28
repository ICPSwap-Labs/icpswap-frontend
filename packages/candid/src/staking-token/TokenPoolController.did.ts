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
  const Result_9 = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
  const Result_8 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
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
  const TokenPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Principal,
    stakingToken: Token,
    rewardToken: Token,
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
    content: IDL.Vec(TokenPoolInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_6 = IDL.Variant({ ok: Page, err: Page });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_4 = IDL.Variant({ ok: CycleInfo, err: Error });
  const GlobalDataInfo = IDL.Record({
    rewardAmount: IDL.Float64,
    stakingAmount: IDL.Float64,
  });
  const Result_3 = IDL.Variant({ ok: GlobalDataInfo, err: IDL.Text });
  const Result_2 = IDL.Variant({
    ok: IDL.Record({ governanceCid: IDL.Opt(IDL.Principal) }),
    err: Error,
  });
  const Result_1 = IDL.Variant({
    ok: TokenGlobalDataInfo,
    err: IDL.Text,
  });
  const Result = IDL.Variant({ ok: TokenPoolInfo, err: IDL.Text });
  return IDL.Service({
    createTokenPool: IDL.Func([InitRequest], [Result_9], []),
    deleteTokenPool: IDL.Func([IDL.Principal], [Result_8], []),
    findPoolStatInfo: IDL.Func([], [Result_7], ["query"]),
    findTokenPoolPage: IDL.Func([IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [Result_6], ["query"]),
    getAdmins: IDL.Func([], [Result_5], ["query"]),
    getCycleInfo: IDL.Func([], [Result_4], []),
    getGlobalData: IDL.Func([], [Result_3], ["query"]),
    getInitArgs: IDL.Func([], [Result_2], ["query"]),
    getPoolStatInfo: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    getTokenPool: IDL.Func([IDL.Principal], [Result], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    startTokenPool: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [Result], []),
    stopTokenPool: IDL.Func([IDL.Principal], [Result], []),
    task_end: IDL.Func([], [], []),
    task_start: IDL.Func([], [], []),
  });
};
