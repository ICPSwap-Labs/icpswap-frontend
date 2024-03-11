export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PublicTokenOverview = IDL.Record({
    id: IDL.Nat,
    totalVolumeUSD: IDL.Float64,
    name: IDL.Text,
    priceUSDChangeWeek: IDL.Float64,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    priceUSDChange: IDL.Float64,
    tvlUSD: IDL.Float64,
    address: IDL.Text,
    volumeUSDWeek: IDL.Float64,
    txCount: IDL.Int,
    priceUSD: IDL.Float64,
    volumeUSDChange: IDL.Float64,
    tvlUSDChange: IDL.Float64,
    standard: IDL.Text,
    tvlToken: IDL.Float64,
    symbol: IDL.Text
  });
  const PoolInfo = IDL.Record({
    fee: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    token1Price: IDL.Float64,
    token1Decimals: IDL.Float64,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text
  });
  const PublicTokenChartDayData = IDL.Record({
    id: IDL.Int,
    volumeUSD: IDL.Float64,
    tvlUSD: IDL.Float64,
    timestamp: IDL.Int,
    txCount: IDL.Int
  });
  const PublicTokenPricesData = IDL.Record({
    id: IDL.Int,
    low: IDL.Float64,
    high: IDL.Float64,
    close: IDL.Float64,
    open: IDL.Float64,
    timestamp: IDL.Int
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
    cycleAvailable: IDL.Func([], [NatResult], ["query"]),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    deleteToken: IDL.Func([IDL.Text], [], []),
    getAllToken: IDL.Func([IDL.Opt(IDL.Nat)], [IDL.Vec(PublicTokenOverview)], ["query"]),
    getBaseDataStructureCanister: IDL.Func([], [IDL.Text], ["query"]),
    getLastID: IDL.Func([IDL.Nat], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ["query"]),
    getPoolsForToken: IDL.Func([IDL.Text], [IDL.Vec(PoolInfo)], ["query"]),
    getRollIndex: IDL.Func([], [IDL.Nat], ["query"]),
    getStartHeartBeatStatus: IDL.Func([], [IDL.Bool], ["query"]),
    getToken: IDL.Func([IDL.Text], [PublicTokenOverview], ["query"]),
    getTokenChartData: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(PublicTokenChartDayData)], ["query"]),
    getTokenPricesData: IDL.Func([IDL.Text, IDL.Int, IDL.Int, IDL.Nat], [IDL.Vec(PublicTokenPricesData)], ["query"]),
    getTokenTransactions: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(TransactionsType)], ["query"]),
    getTvlRecord: IDL.Func([IDL.Nat], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Float64)))], ["query"]),
    reset: IDL.Func([], [], []),
    rollBackData: IDL.Func([IDL.Vec(TransactionsType)], [], []),
    rollBackStatus: IDL.Func([IDL.Bool], [], ["query"]),
    saveTransactions: IDL.Func([TransactionsType, IDL.Bool], [], [])
  });
};
export const init = ({ IDL }: any) => {
  return [];
};
