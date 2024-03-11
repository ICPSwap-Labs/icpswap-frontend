export const idlFactory = ({ IDL }: any) => {
  const Passcode = IDL.Record({
    fee: IDL.Nat,
    token0: IDL.Principal,
    token1: IDL.Principal,
  });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Null, err: Error });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const CreatePoolArgs = IDL.Record({
    fee: IDL.Nat,
    sqrtPriceX96: IDL.Text,
    token0: Token,
    token1: Token,
  });
  const PoolData = IDL.Record({
    fee: IDL.Nat,
    key: IDL.Text,
    tickSpacing: IDL.Int,
    token0: Token,
    token1: Token,
    canisterId: IDL.Principal,
  });
  const Result_4 = IDL.Variant({ ok: PoolData, err: Error });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_7 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Result_6 = IDL.Variant({
    ok: IDL.Opt(IDL.Principal),
    err: Error,
  });
  const Result_5 = IDL.Variant({ ok: IDL.Vec(Passcode), err: Error });
  const GetPoolArgs = IDL.Record({
    fee: IDL.Nat,
    token0: Token,
    token1: Token,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Vec(PoolData), err: Error });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(Passcode))),
    err: Error,
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: Error });
  return IDL.Service({
    addPasscode: IDL.Func([IDL.Principal, Passcode], [Result_1], []),
    addPoolControllers: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    batchAddPoolControllers: IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    batchRemovePoolControllers: IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    batchSetPoolAdmins: IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    clearRemovedPool: IDL.Func([IDL.Principal], [IDL.Text], []),
    createPool: IDL.Func([CreatePoolArgs], [Result_4], []),
    deletePasscode: IDL.Func([IDL.Principal, Passcode], [Result_1], []),
    getCycleInfo: IDL.Func([], [Result_7], []),
    getGovernanceCid: IDL.Func([], [Result_6], ["query"]),
    getPasscodesByPrincipal: IDL.Func([IDL.Principal], [Result_5], ["query"]),
    getPool: IDL.Func([GetPoolArgs], [Result_4], ["query"]),
    getPools: IDL.Func([], [Result_2], ["query"]),
    getPrincipalPasscodes: IDL.Func([], [Result_3], ["query"]),
    getRemovedPools: IDL.Func([], [Result_2], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    removePool: IDL.Func([GetPoolArgs], [IDL.Text], []),
    removePoolControllers: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    removePoolWithdrawErrorLog: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Bool],
      [Result_1],
      []
    ),
    restorePool: IDL.Func([IDL.Principal], [IDL.Text], []),
    setPoolAdmins: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    upgradePoolTokenStandard: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [Result],
      []
    ),
  });
};
