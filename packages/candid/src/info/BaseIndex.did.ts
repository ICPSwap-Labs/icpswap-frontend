export const idlFactory = ({ IDL }: any) => {
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    limitOrder: IDL.Record({
      token0InAmount: IDL.Nat,
      positionId: IDL.Nat,
      tickLimit: IDL.Int,
      token1InAmount: IDL.Nat,
    }),
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    transferPosition: IDL.Nat,
    increaseLiquidity: IDL.Null,
  });
  const SwapRecordInfo__1 = IDL.Record({
    to: IDL.Text,
    feeAmount: IDL.Int,
    action: TransactionType,
    feeAmountTotal: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token0AmountTotal: IDL.Nat,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    tick: IDL.Int,
    feeTire: IDL.Nat,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Nat,
    token1AmountTotal: IDL.Nat,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Nat,
    token1Fee: IDL.Nat,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Nat,
    token0Standard: IDL.Text,
    price: IDL.Nat,
    poolId: IDL.Text,
  });
  const PoolTvlData = IDL.Record({
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    tvlUSD: IDL.Float64,
    token0Symbol: IDL.Text,
    token1Symbol: IDL.Text,
  });
  const SwapRecordInfo = IDL.Record({
    to: IDL.Text,
    feeAmount: IDL.Int,
    action: TransactionType,
    feeAmountTotal: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token0AmountTotal: IDL.Nat,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    tick: IDL.Int,
    feeTire: IDL.Nat,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Nat,
    token1AmountTotal: IDL.Nat,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Nat,
    token1Fee: IDL.Nat,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Nat,
    token0Standard: IDL.Text,
    price: IDL.Nat,
    poolId: IDL.Text,
  });
  const SwapErrorInfo = IDL.Record({
    data: SwapRecordInfo,
    error: IDL.Text,
    timestamp: IDL.Int,
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PoolBaseInfo = IDL.Record({
    fee: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    token1Standard: IDL.Text,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token1Symbol: IDL.Text,
  });
  const TokenPrice = IDL.Record({
    tokenId: IDL.Text,
    volumeUSD7d: IDL.Float64,
    priceICP: IDL.Float64,
    priceUSD: IDL.Float64,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const Token = IDL.Record({ arbitrary_data: IDL.Text });
  const StreamingCallbackHttpResponse = IDL.Record({
    token: IDL.Opt(Token),
    body: IDL.Vec(IDL.Nat8),
  });
  const CallbackStrategy = IDL.Record({
    token: Token,
    callback: IDL.Func([Token], [StreamingCallbackHttpResponse], ["query"]),
  });
  const StreamingStrategy = IDL.Variant({ Callback: CallbackStrategy });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    upgrade: IDL.Opt(IDL.Bool),
    streaming_strategy: IDL.Opt(StreamingStrategy),
    status_code: IDL.Nat16,
  });
  return IDL.Service({
    addClient: IDL.Func([IDL.Principal], [], []),
    baseLastStorage: IDL.Func([], [IDL.Text], ["query"]),
    baseStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    batchPush: IDL.Func([IDL.Vec(SwapRecordInfo__1)], [], []),
    batchUpdatePoolTvl: IDL.Func([IDL.Vec(PoolTvlData)], [], []),
    batchUpdateTokenPrice7dVolumeUSD: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], [], []),
    cleanErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPools: IDL.Func([], [IDL.Vec(PoolBaseInfo)], ["query"]),
    getAllowTokens: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    getClients: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getControllers: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getDataQueue: IDL.Func([], [IDL.Vec(SwapRecordInfo__1)], ["query"]),
    getErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], ["query"]),
    getPoolLastPrice: IDL.Func([IDL.Principal], [IDL.Float64], ["query"]),
    getPoolLastPriceTime: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))], ["query"]),
    getPoolTvl: IDL.Func([], [IDL.Vec(PoolTvlData)], ["query"]),
    getQuoteTokens: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getStorageCount: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Int], ["query"]),
    getSyncError: IDL.Func([], [IDL.Text], ["query"]),
    getSyncLock: IDL.Func([], [IDL.Bool], ["query"]),
    getTokenPriceMetadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, TokenPrice))], ["query"]),
    getTransferPositionStorageCount: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Int], ["query"]),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    push: IDL.Func([SwapRecordInfo__1], [], []),
    removeTokenMetadata: IDL.Func([IDL.Principal], [], []),
    retryErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], []),
    setQuoteTokens: IDL.Func([IDL.Vec(IDL.Text), IDL.Bool], [], []),
    transferPositionLastStorage: IDL.Func([], [IDL.Text], ["query"]),
    transferPositionStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    updateMiniProportion: IDL.Func([IDL.Float64], [], []),
    updateTokenMetadata: IDL.Func([IDL.Principal, IDL.Text, IDL.Nat], [], []),
  });
};
