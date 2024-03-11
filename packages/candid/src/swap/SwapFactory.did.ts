export const idlFactory = ({ IDL }: any) => {
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
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_1 = IDL.Variant({ ok: PoolData, err: Error });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
  const GetPoolArgs = IDL.Record({
    fee: IDL.Nat,
    token0: Token,
    token1: Token,
  });
  const Result = IDL.Variant({ ok: IDL.Vec(PoolData), err: Error });
  const SwapFactory = IDL.Service({
    createPool: IDL.Func([CreatePoolArgs], [Result_1], []),
    deletePool: IDL.Func([IDL.Text], [], []),
    getAccessControlState: IDL.Func(
      [],
      [
        IDL.Record({
          owners: IDL.Vec(IDL.Principal),
          clients: IDL.Vec(IDL.Principal),
        }),
      ],
      [],
    ),
    getAvailabilityState: IDL.Func(
      [],
      [
        IDL.Record({
          whiteList: IDL.Vec(IDL.Principal),
          available: IDL.Bool,
        }),
      ],
      [],
    ),
    getCycleInfo: IDL.Func([], [Result_2], []),
    getPool: IDL.Func([GetPoolArgs], [Result_1], ["query"]),
    getPools: IDL.Func([], [Result], ["query"]),
    getRemovedPools: IDL.Func([], [Result], ["query"]),
    removePool: IDL.Func([GetPoolArgs], [], []),
    setAvailable: IDL.Func([IDL.Bool], [], []),
    setClients: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setOwnerToPool: IDL.Func([IDL.Text, IDL.Vec(IDL.Principal)], [], []),
    setOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setWhiteList: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
  });
  return SwapFactory;
};
