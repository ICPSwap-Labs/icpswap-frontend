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
    token1AmountLimit: IDL.Nat,
  });
  const Result_4 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result = IDL.Variant({
    ok: IDL.Record({
      farmIndexCid: IDL.Principal,
      governanceCid: IDL.Opt(IDL.Principal),
      feeReceiverCid: IDL.Principal,
    }),
    err: Error,
  });
  return IDL.Service({
    addFarmControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    create: IDL.Func([CreateFarmArgs], [Result_4], []),
    getAdmins: IDL.Func([], [Result_3], ["query"]),
    getAllFarms: IDL.Func([], [Result_3], ["query"]),
    getCycleInfo: IDL.Func([], [Result_2], []),
    getFee: IDL.Func([], [Result_1], ["query"]),
    getInitArgs: IDL.Func([], [Result], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    removeFarmControllers: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setFarmAdmins: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    setFee: IDL.Func([IDL.Nat], [], []),
  });
};
