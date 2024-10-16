export const idlFactory = ({ IDL }: any) => {
  const Result_6 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const PoolAprIndex = IDL.Record({
    aprAvg1D: IDL.Float64,
    aprAvg7D: IDL.Float64,
    pool: IDL.Principal,
    aprAvg30D: IDL.Float64,
  });
  const Result_5 = IDL.Variant({ ok: PoolAprIndex, err: IDL.Text });
  const PositionIndex = IDL.Record({
    accountId: IDL.Text,
    aprAvg7D: IDL.Float64,
    feesAvg24H: IDL.Float64,
    feesAvg30D: IDL.Float64,
    pool: IDL.Principal,
    positionId: IDL.Nat,
    aprAvg24H: IDL.Float64,
    aprAvg30D: IDL.Float64,
    feesAvg7D: IDL.Float64,
    valueAvg7D: IDL.Float64,
    valueAvg24H: IDL.Float64,
    valueAvg30D: IDL.Float64,
  });
  const Result_4 = IDL.Variant({ ok: PositionIndex, err: IDL.Text });
  const PriceIndex = IDL.Record({
    priceLow7D: IDL.Float64,
    pool: IDL.Principal,
    priceHigh24H: IDL.Float64,
    priceHigh30D: IDL.Float64,
    priceHigh7D: IDL.Float64,
    priceLow24H: IDL.Float64,
    priceLow30D: IDL.Float64,
  });
  const Result_3 = IDL.Variant({ ok: PriceIndex, err: IDL.Text });
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
  const Result_2 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const Page_1 = IDL.Record({
    content: IDL.Vec(PositionIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(PriceIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  const UploadPositionRequests = IDL.Record({
    positionIndexs: IDL.Vec(PositionIndex),
  });
  const UploadPriceRequests = IDL.Record({
    priceIndexs: IDL.Vec(PriceIndex),
  });
  return IDL.Service({
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_6], ["query"]),
    getPoolAprIndex: IDL.Func([IDL.Principal], [Result_5], ["query"]),
    getPositionIndex: IDL.Func([IDL.Principal, IDL.Nat], [Result_4], ["query"]),
    getPriceIndex: IDL.Func([IDL.Principal], [Result_3], ["query"]),
    getTaskState: IDL.Func([], [IDL.Bool], ["query"]),
    queryPoolDataIndexPage: IDL.Func([IDL.Nat, IDL.Nat], [Result_2], ["query"]),
    queryPositionIndexPage: IDL.Func([IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat], [Result_1], ["query"]),
    queryPriceIndexPage: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setTaskState: IDL.Func([IDL.Bool], [IDL.Bool], []),
    uploadPositionIndex: IDL.Func([UploadPositionRequests], [IDL.Bool], []),
    uploadPriceIndex: IDL.Func([UploadPriceRequests], [IDL.Bool], []),
  });
};
