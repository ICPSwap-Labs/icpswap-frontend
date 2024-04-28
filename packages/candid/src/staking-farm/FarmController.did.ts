export const idlFactory = ({ IDL }: any) => {
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const CreateFarmArgs = IDL.Record({
    startTime: IDL.Nat,
    secondPerCycle: IDL.Nat,
    rewardToken: Token,
    endTime: IDL.Nat,
    rewardAmount: IDL.Nat,
    pool: IDL.Principal,
    refunder: IDL.Principal,
    priceInsideLimit: IDL.Bool,
    token0AmountLimit: IDL.Nat,
    rewardPool: IDL.Principal,
    token1AmountLimit: IDL.Nat,
  });
  const Result_6 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
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
  const TVL = IDL.Record({
    stakedTokenTVL: IDL.Float64,
    rewardTokenTVL: IDL.Float64,
  });
  const Result_4 = IDL.Variant({
    ok: IDL.Record({
      LIVE: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      NOT_STARTED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      CLOSED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      FINISHED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
    }),
    err: IDL.Text,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_3 = IDL.Variant({ ok: CycleInfo, err: Error });
  const FarmStatus = IDL.Variant({
    LIVE: IDL.Null,
    NOT_STARTED: IDL.Null,
    CLOSED: IDL.Null,
    FINISHED: IDL.Null,
  });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
    err: IDL.Text,
  });
  const Result_1 = IDL.Variant({ ok: TVL, err: Error });
  const Result = IDL.Variant({
    ok: IDL.Record({
      ICP: Token,
      governanceCid: IDL.Opt(IDL.Principal),
    }),
    err: Error,
  });
  return IDL.Service({
    create: IDL.Func([CreateFarmArgs], [Result_6], []),
    getAdmins: IDL.Func([], [Result_5], ["query"]),
    getAllFarms: IDL.Func([], [Result_4], ["query"]),
    getCycleInfo: IDL.Func([], [Result_3], []),
    getFarms: IDL.Func([IDL.Opt(FarmStatus)], [Result_2], ["query"]),
    getGlobalTVL: IDL.Func([], [Result_1], ["query"]),
    getInitArgs: IDL.Func([], [Result], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    updateFarmInfo: IDL.Func([FarmStatus, FarmStatus, TVL], [], []),
  });
};
