export const idlFactory = ({ IDL }: any) => {
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Bool, err: Error });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: Error });
  const PositionIndex = IDL.Service({
    addPoolId: IDL.Func([IDL.Text], [Result], []),
    getControllers: IDL.Func([], [Result_3], ["query"]),
    getCycleInfo: IDL.Func([], [Result_2], []),
    getPools: IDL.Func([], [Result_1], ["query"]),
    getUserPools: IDL.Func([IDL.Text], [Result_1], ["query"]),
    initUserPoolMap: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Text)))], [], []),
    removePoolId: IDL.Func([IDL.Text], [Result], []),
    removePoolIdWithoutCheck: IDL.Func([IDL.Text], [Result], []),
    setOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    updatePoolIds: IDL.Func([], [], []),
  });
  return PositionIndex;
};
