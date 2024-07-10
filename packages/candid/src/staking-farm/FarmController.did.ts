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
  const Result_7 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_1 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const TokenAmount = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat,
    standard: IDL.Text,
  });
  const TVL = IDL.Record({
    rewardToken: TokenAmount,
    poolToken0: TokenAmount,
    poolToken1: TokenAmount,
  });
  const Result_6 = IDL.Variant({
    ok: IDL.Record({
      LIVE: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      NOT_STARTED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      CLOSED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
      FINISHED: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
    }),
    err: IDL.Text,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_5 = IDL.Variant({ ok: CycleInfo, err: Error });
  const FarmStatus = IDL.Variant({
    LIVE: IDL.Null,
    NOT_STARTED: IDL.Null,
    CLOSED: IDL.Null,
    FINISHED: IDL.Null,
  });
  const Result_4 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, TVL)),
    err: IDL.Text,
  });
  const Result_3 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result_2 = IDL.Variant({
    ok: IDL.Record({
      governanceCid: IDL.Opt(IDL.Principal),
      feeReceiverCid: IDL.Principal,
    }),
    err: Error,
  });
  const Result = IDL.Variant({
    ok: IDL.Record({ farmAmount: IDL.Nat, principalAmount: IDL.Nat }),
    err: Error,
  });
  return IDL.Service({
    addFarmControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    create: IDL.Func([CreateFarmArgs], [Result_7], []),
    getAdmins: IDL.Func([], [Result_1], ["query"]),
    getAllFarmId: IDL.Func([], [Result_1], ["query"]),
    getAllFarms: IDL.Func([], [Result_6], ["query"]),
    getCycleInfo: IDL.Func([], [Result_5], []),
    getFarms: IDL.Func([IDL.Opt(FarmStatus)], [Result_4], ["query"]),
    getFee: IDL.Func([], [Result_3], ["query"]),
    getInitArgs: IDL.Func([], [Result_2], ["query"]),
    getPrincipalRecord: IDL.Func([], [Result_1], ["query"]),
    getTotalAmount: IDL.Func([], [Result], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    removeFarmControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setFarmAdmins: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setFee: IDL.Func([IDL.Nat], [], []),
    updateFarmInfo: IDL.Func([FarmStatus, TVL], [], []),
    updatePrincipalRecord: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
  });
};
