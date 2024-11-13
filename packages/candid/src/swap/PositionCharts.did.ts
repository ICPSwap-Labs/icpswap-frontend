export const idlFactory = ({ IDL }: any) => {
  const Result_11 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const PoolAprIndex = IDL.Record({
    aprAvg1D: IDL.Float64,
    aprAvg7D: IDL.Float64,
    pool: IDL.Principal,
    aprAvg30D: IDL.Float64,
  });
  const Result_10 = IDL.Variant({ ok: PoolAprIndex, err: IDL.Text });
  const PositionDataIndex = IDL.Record({
    apr: IDL.Float64,
    snapshotTime: IDL.Nat,
    token0FeeAmount: IDL.Nat,
    value: IDL.Float64,
    token1FeeDayAmount: IDL.Nat,
    fees: IDL.Float64,
    pool: IDL.Principal,
    positionId: IDL.Nat,
    token0Amount: IDL.Nat,
    token1USDPrice: IDL.Float64,
    dayId: IDL.Nat,
    token1Amount: IDL.Nat,
    token1FeeAmount: IDL.Nat,
    token0FeeDayAmount: IDL.Nat,
    token0USDPrice: IDL.Float64,
  });
  const Result_9 = IDL.Variant({
    ok: IDL.Vec(PositionDataIndex),
    err: IDL.Text,
  });
  const PriceIndex = IDL.Record({
    priceLow7D: IDL.Float64,
    pool: IDL.Principal,
    priceHigh24H: IDL.Float64,
    priceHigh30D: IDL.Float64,
    priceHigh7D: IDL.Float64,
    priceLow24H: IDL.Float64,
    priceLow30D: IDL.Float64,
  });
  const Result_8 = IDL.Variant({ ok: PriceIndex, err: IDL.Text });
  const TaskPositionStatus = IDL.Record({
    lastSyncDay4Position: IDL.Nat,
    syncErrorMsgs: IDL.Vec(IDL.Text),
    syncPoolSize: IDL.Nat,
    taskStatus: IDL.Bool,
    currentSyncPool: IDL.Text,
    pendingSyncPoolSize: IDL.Nat,
    step1: IDL.Text,
    step2: IDL.Text,
    step3: IDL.Text,
    step4: IDL.Text,
    step5: IDL.Text,
    currentPoolPositionSize: IDL.Nat,
    currentDay: IDL.Nat,
    syncPositionDataLock: IDL.Bool,
    nowTime: IDL.Nat,
  });
  const TaskPriceStatus = IDL.Record({
    syncErrorMsgs: IDL.Vec(IDL.Text),
    syncPoolSize: IDL.Nat,
    taskStatus: IDL.Bool,
    currentSyncPool: IDL.Text,
    pendingSyncPoolSize: IDL.Nat,
    currentHour: IDL.Nat,
    step1: IDL.Text,
    step2: IDL.Text,
    step3: IDL.Text,
    step4: IDL.Text,
    lastSyncHour4PoolPrice: IDL.Nat,
    currentDay: IDL.Nat,
    syncPoolPriceLock: IDL.Bool,
    nowTime: IDL.Nat,
  });
  const TaskStatus = IDL.Record({
    lastSyncDay4Position: IDL.Nat,
    lastSyncDay4PoolData: IDL.Nat,
    totalPoolSize: IDL.Nat,
    taskStatus: IDL.Bool,
    currentHour: IDL.Nat,
    syncPoolDataLock: IDL.Bool,
    pendingSyncPriceSize: IDL.Nat,
    totalTokenListSize: IDL.Nat,
    lastSyncHour4PoolPrice: IDL.Nat,
    currentDay: IDL.Nat,
    pendingSyncPoolDataSize: IDL.Nat,
    syncPositionDataLock: IDL.Bool,
    pendingSyncPositionSize: IDL.Nat,
    syncPoolPriceLock: IDL.Bool,
    nowTime: IDL.Nat,
  });
  const Result_7 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Record({
        apr: IDL.Float64,
        snapshotTime: IDL.Nat,
        dayId: IDL.Nat,
        poolId: IDL.Text,
      }),
    ),
    err: IDL.Text,
  });
  const ICPSwapPoolDataIndex = IDL.Record({
    low: IDL.Float64,
    snapshotTime: IDL.Nat,
    volumeToken0: IDL.Float64,
    volumeToken1: IDL.Float64,
    sqrtPrice: IDL.Float64,
    high: IDL.Float64,
    close: IDL.Float64,
    open: IDL.Float64,
    token1Price: IDL.Float64,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    tvlUSD: IDL.Float64,
    token0LockedAmount: IDL.Float64,
    txCount: IDL.Int,
    token1LedgerId: IDL.Text,
    dayId: IDL.Nat,
    token0LedgerId: IDL.Text,
    token1LockedAmount: IDL.Float64,
    token0Price: IDL.Float64,
    poolId: IDL.Text,
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(ICPSwapPoolDataIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_6 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Record({
        snapshotTime: IDL.Nat,
        price: IDL.Float64,
        hourId: IDL.Nat,
        dayId: IDL.Nat,
        poolId: IDL.Principal,
      }),
    ),
    err: IDL.Text,
  });
  const Result_4 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Record({
        apr: IDL.Float64,
        snapshotTime: IDL.Nat,
        positionId: IDL.Nat,
        dayId: IDL.Nat,
        poolId: IDL.Principal,
      }),
    ),
    err: IDL.Text,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(PositionDataIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_3 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Record({
        snapshotTime: IDL.Nat,
        fees: IDL.Float64,
        positionId: IDL.Nat,
        dayId: IDL.Nat,
        poolId: IDL.Principal,
      }),
    ),
    err: IDL.Text,
  });
  const Result_1 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Record({
        snapshotTime: IDL.Nat,
        value: IDL.Float64,
        positionId: IDL.Nat,
        dayId: IDL.Nat,
        poolId: IDL.Principal,
      }),
    ),
    err: IDL.Text,
  });
  const Page = IDL.Record({
    content: IDL.Vec(PriceIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  return IDL.Service({
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_11], ["query"]),
    getPoolAprIndex: IDL.Func([IDL.Principal], [Result_10], ["query"]),
    getPositionIndexs: IDL.Func([IDL.Principal, IDL.Nat], [Result_9], ["query"]),
    getPriceIndex: IDL.Func([IDL.Principal], [Result_8], ["query"]),
    getStat: IDL.Func([], [TaskPositionStatus], ["query"]),
    getStatPrice: IDL.Func([], [TaskPriceStatus], ["query"]),
    getStatus: IDL.Func([], [TaskStatus], ["query"]),
    getTaskState: IDL.Func([], [IDL.Bool], ["query"]),
    queryPoolAprLine: IDL.Func([IDL.Principal], [Result_7], ["query"]),
    queryPoolDataIndexPage: IDL.Func([IDL.Nat, IDL.Nat], [Result_6], ["query"]),
    queryPoolPriceLine: IDL.Func([IDL.Principal], [Result_5], ["query"]),
    queryPositionAprLine: IDL.Func([IDL.Principal, IDL.Nat], [Result_4], ["query"]),
    queryPositionDataIndexPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [Result_3], ["query"]),
    queryPositionFeesLine: IDL.Func([IDL.Principal, IDL.Nat], [Result_2], ["query"]),
    queryPositionValueLine: IDL.Func([IDL.Principal, IDL.Nat], [Result_1], ["query"]),
    queryPriceIndexPage: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setTaskState: IDL.Func([IDL.Bool], [IDL.Bool], []),
    syncPoolAndTokenList: IDL.Func([], [], []),
    syncPoolPriceData: IDL.Func([], [], []),
    syncPositionData: IDL.Func([], [], []),
  });
};
