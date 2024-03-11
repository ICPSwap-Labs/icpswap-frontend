export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PublicPoolOverView = IDL.Record({
    id: IDL.Nat,
    volumeUSD1d: IDL.Float64,
    volumeUSD7d: IDL.Float64,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    totalVolumeUSD: IDL.Float64,
    sqrtPrice: IDL.Float64,
    pool: IDL.Text,
    tick: IDL.Int,
    liquidity: IDL.Nat,
    token1Price: IDL.Float64,
    feeTier: IDL.Nat,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    token1Standard: IDL.Text,
    txCount: IDL.Nat,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text
  });
  const PublicPoolChartDayData = IDL.Record({
    id: IDL.Int,
    volumeUSD: IDL.Float64,
    timestamp: IDL.Int,
    txCount: IDL.Int
  });
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    increaseLiquidity: IDL.Null
  });
  const Transaction = IDL.Record({
    to: IDL.Text,
    action: TransactionType,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    hash: IDL.Text,
    tick: IDL.Int,
    token1Price: IDL.Float64,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Float64,
    sender: IDL.Text,
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
    addOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPools: IDL.Func([], [IDL.Vec(PublicPoolOverView)], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getPool: IDL.Func([IDL.Text], [PublicPoolOverView], ["query"]),
    getPoolChartData: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(PublicPoolChartDayData)], ["query"]),
    getPoolTransactions: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(Transaction)], ["query"]),
    insert: IDL.Func([Transaction], [], [])
  });
};
