export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const TvlChartDayData = IDL.Record({
    id: IDL.Int,
    tvlUSD: IDL.Float64,
    timestamp: IDL.Int
  });
  const TvlOverview = IDL.Record({
    tvlUSD: IDL.Float64,
    tvlUSDChange: IDL.Float64
  });
  const PoolInfo = IDL.Record({
    fee: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    token1Price: IDL.Float64,
    token1Standard: IDL.Text,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text
  });
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    increaseLiquidity: IDL.Null
  });
  const TransactionsType = IDL.Record({
    to: IDL.Text,
    action: TransactionType,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    exchangePrice: IDL.Float64,
    hash: IDL.Text,
    tick: IDL.Int,
    token1Price: IDL.Float64,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Float64,
    sender: IDL.Text,
    exchangeRate: IDL.Float64,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Float64,
    token1Fee: IDL.Float64,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Float64,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    amountUSD: IDL.Float64,
    amountToken0: IDL.Float64,
    amountToken1: IDL.Float64,
    poolFee: IDL.Nat,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text,
    poolId: IDL.Text
  });
  return IDL.Service({
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPoolTvl: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], ["query"]),
    getAllTokenTvl: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], ["query"]),
    getPoolChartTvl: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(TvlChartDayData)], ["query"]),
    getPoolLastTvl: IDL.Func([IDL.Text], [TvlOverview], ["query"]),
    getPools: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, PoolInfo))], ["query"]),
    getSyncError: IDL.Func([], [IDL.Text], ["query"]),
    getTokenChartTvl: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(TvlChartDayData)], ["query"]),
    getTokenLastTvl: IDL.Func([IDL.Text], [TvlOverview], ["query"]),
    saveTransactions: IDL.Func([TransactionsType], [], [])
  });
};
