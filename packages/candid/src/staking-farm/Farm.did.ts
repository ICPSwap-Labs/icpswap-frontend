export const idlFactory = ({ IDL }: any) => {
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: Error });
  const Result_15 = IDL.Variant({
    ok: IDL.Record({ rewardPoolCid: IDL.Text, poolCid: IDL.Text }),
    err: Error
  });
  const Result_14 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_13 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Deposit = IDL.Record({
    tickUpper: IDL.Int,
    rewardAmount: IDL.Nat,
    owner: IDL.Text,
    pool: IDL.Text,
    liquidity: IDL.Nat,
    initTime: IDL.Nat,
    positionId: IDL.Nat,
    token0Amount: IDL.Int,
    holder: IDL.Text,
    token1Amount: IDL.Int,
    tickLower: IDL.Int
  });
  const Result_12 = IDL.Variant({ ok: Deposit, err: Error });
  const DistributeRecord = IDL.Record({
    rewardTotal: IDL.Nat,
    owner: IDL.Principal,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    rewardGained: IDL.Nat
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(DistributeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_11 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const FarmInfo = IDL.Record({
    startTime: IDL.Nat,
    status: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Principal,
    numberOfStakes: IDL.Nat,
    rewardToken: Token,
    endTime: IDL.Nat,
    totalRewardBalance: IDL.Nat,
    farmCid: IDL.Text,
    pool: IDL.Text,
    refunder: IDL.Principal,
    totalRewardClaimed: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    poolToken0: Token,
    poolToken1: Token,
    poolFee: IDL.Nat,
    totalReward: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    userNumberOfStakes: IDL.Nat,
    totalRewardUnclaimed: IDL.Nat,
    positionIds: IDL.Vec(IDL.Nat)
  });
  const Result_10 = IDL.Variant({ ok: FarmInfo, err: Error });
  const Result_9 = IDL.Variant({
    ok: IDL.Record({
      priceInsideLimit: IDL.Bool,
      positionNumLimit: IDL.Nat,
      token0AmountLimit: IDL.Nat,
      token1AmountLimit: IDL.Nat
    }),
    err: Error
  });
  const Result_8 = IDL.Variant({
    ok: IDL.Record({
      poolToken0Amount: IDL.Nat,
      totalLiquidity: IDL.Nat,
      poolToken1Amount: IDL.Nat
    }),
    err: Error
  });
  const Result_7 = IDL.Variant({ ok: IDL.Vec(IDL.Nat), err: Error });
  const Result_6 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result_5 = IDL.Variant({
    ok: IDL.Record({
      secondPerCycle: IDL.Nat,
      totalRewardBalance: IDL.Nat,
      rewardPerCycle: IDL.Nat,
      totalRewardClaimed: IDL.Nat,
      totalCycleCount: IDL.Nat,
      currentCycleCount: IDL.Nat,
      totalReward: IDL.Nat,
      totalRewardUnclaimed: IDL.Nat
    }),
    err: Error
  });
  const TransType = IDL.Variant({
    claim: IDL.Null,
    distribute: IDL.Null,
    unstake: IDL.Null,
    stake: IDL.Null
  });
  const StakeRecord = IDL.Record({
    to: IDL.Principal,
    transType: TransType,
    from: IDL.Principal,
    liquidity: IDL.Nat,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    amount: IDL.Nat
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(StakeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_4 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Result_3 = IDL.Variant({
    ok: IDL.Record({
      stakedTokenTVL: IDL.Float64,
      rewardTokenTVL: IDL.Float64
    }),
    err: Error
  });
  const Page = IDL.Record({
    content: IDL.Vec(Deposit),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_2 = IDL.Variant({ ok: Page, err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Float64, err: Error });
  const InitFarm = IDL.Record({
    ICP: Token,
    startTime: IDL.Nat,
    status: IDL.Text,
    secondPerCycle: IDL.Nat,
    creator: IDL.Principal,
    rewardToken: Token,
    controllerList: IDL.Vec(IDL.Principal),
    endTime: IDL.Nat,
    pool: IDL.Text,
    refunder: IDL.Principal,
    priceInsideLimit: IDL.Bool,
    token0AmountLimit: IDL.Nat,
    token1AmountLimit: IDL.Nat,
    totalReward: IDL.Nat
  });
  const Farm = IDL.Service({
    clearErrorLog: IDL.Func([], [], []),
    close: IDL.Func([], [Result], []),
    finishManually: IDL.Func([], [Result], []),
    getConfigCids: IDL.Func([], [Result_15], ["query"]),
    getControllers: IDL.Func([], [Result_14], ["query"]),
    getCycleInfo: IDL.Func([], [Result_13], []),
    getDeposit: IDL.Func([IDL.Nat], [Result_12], ["query"]),
    getDistributeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_11], ["query"]),
    getErrorLog: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getFarmInfo: IDL.Func([IDL.Text], [Result_10], ["query"]),
    getLimitInfo: IDL.Func([], [Result_9], ["query"]),
    getLiquidityInfo: IDL.Func([], [Result_8], ["query"]),
    getPositionIds: IDL.Func([], [Result_7], ["query"]),
    getRewardInfo: IDL.Func([IDL.Vec(IDL.Nat)], [Result_6], ["query"]),
    getRewardMeta: IDL.Func([], [Result_5], ["query"]),
    getStakeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_4], ["query"]),
    getTVL: IDL.Func([], [Result_3], ["query"]),
    getTokenBalance: IDL.Func([], [IDL.Nat], []),
    getUserPositions: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [Result_2], ["query"]),
    getUserTVL: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    init: IDL.Func([InitFarm], [FarmInfo], []),
    resetRewardMeta: IDL.Func([], [], []),
    setControllers: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setLimitInfo: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat, IDL.Bool], [], []),
    stake: IDL.Func([IDL.Nat], [Result], []),
    unstake: IDL.Func([IDL.Nat], [Result], [])
  });
  return Farm;
};
