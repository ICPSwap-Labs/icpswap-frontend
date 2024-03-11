export const idlFactory = ({ IDL }: any) => {
  const NatResult__2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const TvlChartDayData = IDL.Record({
    id: IDL.Nat,
    tvlUSD: IDL.Float64,
    timestamp: IDL.Int
  });
  return IDL.Service({
    addOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    cycleAvailable: IDL.Func([], [NatResult__2], []),
    cycleBalance: IDL.Func([], [NatResult__2], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getPoolChartTvl: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(TvlChartDayData)], ["query"]),
    getTokenChartTvl: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(TvlChartDayData)], ["query"]),
    insert: IDL.Func(
      [IDL.Vec(IDL.Tuple(IDL.Text, TvlChartDayData)), IDL.Vec(IDL.Tuple(IDL.Text, TvlChartDayData))],
      [IDL.Nat],
      []
    )
  });
};
