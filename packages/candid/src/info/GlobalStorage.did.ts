export const idlFactory = ({ IDL }: any) => {
  const NatResult__1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PublicSwapChartDayData = IDL.Record({
    id: IDL.Int,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    tvlUSD: IDL.Float64,
    timestamp: IDL.Int,
    txCount: IDL.Int
  });
  return IDL.Service({
    addOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    cycleAvailable: IDL.Func([], [NatResult__1], []),
    cycleBalance: IDL.Func([], [NatResult__1], ["query"]),
    getChartData: IDL.Func([], [IDL.Vec(PublicSwapChartDayData)], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    insert: IDL.Func([PublicSwapChartDayData], [], [])
  });
};
