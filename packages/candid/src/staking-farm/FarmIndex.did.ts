export const idlFactory = ({ IDL }) => {
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const AddFarmIndexArgs = IDL.Record({
    rewardToken: Token,
    farmCid: IDL.Principal,
    poolToken0: Token,
    poolToken1: Token,
    poolCid: IDL.Principal,
    totalReward: IDL.Nat,
  });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_8 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Principal))),
    err: Error,
  });
  const Result_9 = IDL.Variant({
    ok: IDL.Record({
      LIVE: IDL.Vec(IDL.Principal),
      NOT_STARTED: IDL.Vec(IDL.Principal),
      CLOSED: IDL.Vec(IDL.Principal),
      FINISHED: IDL.Vec(IDL.Principal),
    }),
    err: IDL.Text,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_7 = IDL.Variant({ ok: CycleInfo, err: Error });
  const FarmRewardInfo = IDL.Record({
    poolToken0TVL: IDL.Record({
      address: IDL.Principal,
      amount: IDL.Nat,
      standard: IDL.Text,
    }),
    poolToken1TVL: IDL.Record({
      address: IDL.Principal,
      amount: IDL.Nat,
      standard: IDL.Text,
    }),
    pool: IDL.Principal,
    initTime: IDL.Nat,
    totalReward: IDL.Record({
      address: IDL.Principal,
      amount: IDL.Nat,
      standard: IDL.Text,
    }),
  });
  const Result_6 = IDL.Variant({ ok: FarmRewardInfo, err: Error });
  const FarmStatus = IDL.Variant({
    LIVE: IDL.Null,
    NOT_STARTED: IDL.Null,
    CLOSED: IDL.Null,
    FINISHED: IDL.Null,
  });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, FarmRewardInfo)),
    err: Error,
  });
  const Result = IDL.Variant({ ok: IDL.Vec(IDL.Principal), err: Error });
  const Result_4 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const SearchCondition = IDL.Record({
    status: IDL.Opt(IDL.Vec(FarmStatus)),
    rewardToken: IDL.Opt(IDL.Principal),
    pool: IDL.Opt(IDL.Principal),
    user: IDL.Opt(IDL.Principal),
  });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal)),
    err: Error,
  });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(FarmRewardInfo),
    err: Error,
  });
  const Result_1 = IDL.Variant({
    ok: IDL.Record({ farmAmount: IDL.Nat, principalAmount: IDL.Nat }),
    err: Error,
  });
  const TokenAmount = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat,
    standard: IDL.Text,
  });
  const TVL = IDL.Record({
    poolToken0: TokenAmount,
    poolToken1: TokenAmount,
  });
  return IDL.Service({
    addFarmIndex: IDL.Func([AddFarmIndexArgs], [], []),
    getAllFarmUsers: IDL.Func([], [Result_8], ["query"]),
    getAllFarms: IDL.Func([], [Result_9], ["query"]),
    getAllPoolFarms: IDL.Func([], [Result_8], ["query"]),
    getAllRewardTokenFarms: IDL.Func([], [Result_8], ["query"]),
    getAllUserFarms: IDL.Func([], [Result_8], ["query"]),
    getCycleInfo: IDL.Func([], [Result_7], []),
    getFarmRewardTokenInfo: IDL.Func([IDL.Principal], [Result_6], ["query"]),
    getFarmRewardTokenInfos: IDL.Func([IDL.Opt(FarmStatus)], [Result_5], ["query"]),
    getFarmUsers: IDL.Func([IDL.Principal], [Result], ["query"]),
    getFarms: IDL.Func([IDL.Opt(FarmStatus)], [Result_4], ["query"]),
    getFarmsByConditions: IDL.Func([SearchCondition], [Result], ["query"]),
    getFarmsByPool: IDL.Func([IDL.Principal], [Result], ["query"]),
    getFarmsByRewardToken: IDL.Func([IDL.Principal], [Result], ["query"]),
    getLiveFarmsByPools: IDL.Func([IDL.Vec(IDL.Principal)], [Result_3], ["query"]),
    getPrincipalRecord: IDL.Func([], [Result], ["query"]),
    getRewardInfoByStatus: IDL.Func([FarmStatus], [Result_2], ["query"]),
    getTotalAmount: IDL.Func([], [Result_1], ["query"]),
    getUserFarms: IDL.Func([IDL.Principal], [Result], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    syncHisData: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    updateFarmStatus: IDL.Func([FarmStatus], [], []),
    updateFarmTVL: IDL.Func([TVL], [], []),
    updateUserInfo: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
  });
};
