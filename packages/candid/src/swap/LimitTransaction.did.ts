export const idlFactory = ({ IDL }: any) => {
  const LimitOrder = IDL.Record({
    to: IDL.Text,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token0InAmount: IDL.Float64,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    hash: IDL.Text,
    tick: IDL.Int,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Float64,
    positionId: IDL.Nat,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Float64,
    token1Fee: IDL.Float64,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Float64,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    poolFee: IDL.Nat,
    token0Symbol: IDL.Text,
    price: IDL.Nat,
    token0Decimals: IDL.Float64,
    token1Symbol: IDL.Text,
    poolId: IDL.Text,
    token1InAmount: IDL.Float64,
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const QueryResult = IDL.Record({
    total: IDL.Nat,
    records: IDL.Vec(LimitOrder),
    storages: IDL.Vec(IDL.Tuple(IDL.Int, IDL.Principal)),
  });
  return IDL.Service({
    addOwner: IDL.Func([IDL.Principal], [], []),
    batchInsert: IDL.Func([IDL.Vec(LimitOrder)], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    get: IDL.Func([IDL.Text, IDL.Int, IDL.Nat, IDL.Nat], [QueryResult], ["query"]),
    getControllers: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
  });
};
