export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const TvlOverview = IDL.Record({
    tvlUSD: IDL.Float64,
    tvlUSDChange: IDL.Float64
  });
  const PublicProtocolData = IDL.Record({
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    tvlUSD: IDL.Float64,
    txCount: IDL.Int
  });
  return IDL.Service({
    addOwner: IDL.Func([IDL.Principal], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPoolTvl: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], ["query"]),
    getAllTokenTvl: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], ["query"]),
    getAllowTokens: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getPoolLastTvl: IDL.Func([IDL.Text], [TvlOverview], ["query"]),
    getProtocolData: IDL.Func([], [PublicProtocolData], ["query"]),
    getSyncError: IDL.Func([], [IDL.Text], ["query"]),
    getSyncState: IDL.Func([], [IDL.Bool], ["query"]),
    getSyncTime: IDL.Func([], [IDL.Int], ["query"]),
    getTokenLastTvl: IDL.Func([IDL.Text], [TvlOverview], ["query"]),
    getTvlSyncState: IDL.Func([], [IDL.Bool], ["query"]),
    globalLastStorageCanister: IDL.Func([], [IDL.Text], ["query"]),
    globalStorageCanister: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    syncGlobal: IDL.Func([], [], []),
    syncTvl: IDL.Func([], [], []),
    syncTvlStatus: IDL.Func([], [IDL.Bool], ["query"]),
    tvlLastStorageCanister: IDL.Func([], [IDL.Text], ["query"]),
    tvlStorageCanister: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"])
  });
};
