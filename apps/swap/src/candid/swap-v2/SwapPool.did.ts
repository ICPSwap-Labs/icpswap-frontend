export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const AmountAndCycleResult = IDL.Record({
    cycles: IDL.Nat,
    amount0: IDL.Nat,
    amount1: IDL.Nat,
  });
  const ResponseResult_2 = IDL.Variant({
    ok: AmountAndCycleResult,
    err: IDL.Text,
  });
  const ResultAmount = IDL.Record({ amount0: IDL.Nat, amount1: IDL.Nat });
  const ResponseResult_4 = IDL.Variant({
    ok: ResultAmount,
    err: IDL.Text,
  });
  const TextResult = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const VolumeMapType = IDL.Record({ tokenA: IDL.Nat, tokenB: IDL.Nat });
  const ResponseResult_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text,
  });
  const PositionInfo = IDL.Record({
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
  });
  const SharedSlot0 = IDL.Record({
    observationCardinalityNext: IDL.Nat,
    sqrtPriceX96: IDL.Nat,
    observationIndex: IDL.Nat,
    feeProtocol: IDL.Nat,
    tick: IDL.Int,
    unlocked: IDL.Bool,
    observationCardinality: IDL.Nat,
  });
  const TickLiquidityInfo = IDL.Record({
    tickIndex: IDL.Int,
    price0Decimal: IDL.Nat,
    liquidityNet: IDL.Int,
    price0: IDL.Nat,
    price1: IDL.Nat,
    liquidityGross: IDL.Nat,
    price1Decimal: IDL.Nat,
  });
  const Address__1 = IDL.Text;
  const Type__3 = IDL.Nat;
  const PoolInfo = IDL.Record({
    fee: IDL.Nat,
    ticks: IDL.Vec(IDL.Int),
    pool: IDL.Text,
    liquidity: IDL.Nat,
    tickCurrent: IDL.Int,
    token0: IDL.Text,
    token1: IDL.Text,
    sqrtRatioX96: IDL.Nat,
    balance0: IDL.Nat,
    balance1: IDL.Nat,
  });
  const Address = IDL.Text;
  const InitParameters = IDL.Record({
    fee: IDL.Nat,
    tickSpacing: IDL.Nat,
    token1Standard: IDL.Text,
    token0: Address,
    token1: Address,
    factory: Address,
    token0Standard: IDL.Text,
    canisterId: IDL.Text,
  });
  const Type__2 = IDL.Nat;
  const Type = IDL.Int;
  const Type__1 = IDL.Nat;
  const ResponseResult_1 = IDL.Variant({
    ok: IDL.Record({
      cycles: IDL.Nat,
      amount0: IDL.Int,
      amount1: IDL.Int,
    }),
    err: IDL.Text,
  });
  const PaymentEntry = IDL.Record({
    token: Address,
    value: IDL.Nat,
    tokenStandard: IDL.Text,
    recipient: IDL.Principal,
    payer: IDL.Principal,
  });
  const SnapshotCumulativesInsideResult = IDL.Record({
    tickCumulativeInside: IDL.Int,
    secondsPerLiquidityInsideX128: IDL.Nat,
    secondsInside: IDL.Nat,
  });
  const SwapResult = IDL.Record({
    feeAmount: IDL.Int,
    cycles: IDL.Nat,
    amount0: IDL.Int,
    amount1: IDL.Int,
  });
  const ResponseResult = IDL.Variant({ ok: SwapResult, err: IDL.Text });
  const SwapPool = IDL.Service({
    balance: IDL.Func([IDL.Text], [NatResult], []),
    balance0: IDL.Func([], [NatResult], []),
    balance1: IDL.Func([], [NatResult], []),
    burn: IDL.Func([IDL.Int, IDL.Int, IDL.Nat], [ResponseResult_2], []),
    claimSwapFeeRepurchase: IDL.Func([], [], []),
    collect: IDL.Func([IDL.Principal, IDL.Int, IDL.Int, IDL.Nat, IDL.Nat], [ResponseResult_2], []),
    collectProtocol: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [ResponseResult_4], []),
    cycleAvailable: IDL.Func([], [IDL.Nat], []),
    cycleBalance: IDL.Func([], [IDL.Nat], ["query"]),
    flash: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat, IDL.Text], [TextResult], []),
    get24HVolume: IDL.Func([], [VolumeMapType], ["query"]),
    getAdminList: IDL.Func([], [ResponseResult_3], ["query"]),
    getPosition: IDL.Func([IDL.Text], [PositionInfo], ["query"]),
    getSlot0: IDL.Func([], [SharedSlot0], ["query"]),
    getStandard: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    getSwapFeeRepurchase: IDL.Func([], [IDL.Record({ amount0: IDL.Nat, amount1: IDL.Nat })], ["query"]),
    getSwapTokenMap: IDL.Func([IDL.Text], [IDL.Int], ["query"]),
    getTickInfos: IDL.Func([], [IDL.Vec(TickLiquidityInfo)], ["query"]),
    getTickSpacing: IDL.Func([], [IDL.Int], ["query"]),
    getTotalVolume: IDL.Func([], [VolumeMapType], ["query"]),
    getWalletAddress: IDL.Func([], [Address__1], []),
    increaseObservationCardinalityNext: IDL.Func([Type__3], [TextResult], []),
    info: IDL.Func([], [PoolInfo], []),
    infoWithNoBalance: IDL.Func([], [PoolInfo], ["query"]),
    init: IDL.Func([InitParameters], [], []),
    initAdminList: IDL.Func([IDL.Vec(IDL.Text)], [], []),
    initialize: IDL.Func([Type__2], [], []),
    lockPool: IDL.Func([], [], []),
    mint: IDL.Func([IDL.Principal, Type, Type, Type__1, IDL.Nat, IDL.Nat], [ResponseResult_2], []),
    quoter: IDL.Func([IDL.Int, IDL.Nat, IDL.Bool, IDL.Nat, IDL.Nat], [ResponseResult_1], ["query"]),
    rollBackData: IDL.Func([], [], []),
    rollBackTransfer: IDL.Func([], [IDL.Vec(PaymentEntry)], []),
    setFeeProtocol: IDL.Func([IDL.Nat, IDL.Nat], [TextResult], []),
    setLockServerCanisterId: IDL.Func([IDL.Text], [], []),
    setSwapFeeHolderCanisterId: IDL.Func([IDL.Principal], [], []),
    setSwapFeeRepurchase: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    setTransFeeCache: IDL.Func([], [], []),
    snapshotCumulativesInside: IDL.Func([Type, Type], [SnapshotCumulativesInsideResult], ["query"]),
    swap: IDL.Func([IDL.Principal, IDL.Int, IDL.Nat, IDL.Bool, IDL.Nat, IDL.Nat], [ResponseResult], []),
    transFee: IDL.Func([IDL.Text], [NatResult], []),
    transFee0: IDL.Func([], [NatResult], []),
    transFee0Cache: IDL.Func([], [NatResult], ["query"]),
    transFee1: IDL.Func([], [NatResult], []),
    transFee1Cache: IDL.Func([], [NatResult], ["query"]),
    transFeeCache: IDL.Func([IDL.Text], [NatResult], ["query"]),
    unlockPool: IDL.Func([], [], []),
  });
  return SwapPool;
};
