export const idlFactory = ({ IDL }: any) => {
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: Error });
  const Result_9 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_18 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Deposit = IDL.Record({
    tickUpper: IDL.Int,
    rewardAmount: IDL.Nat,
    owner: IDL.Principal,
    liquidity: IDL.Nat,
    initTime: IDL.Nat,
    lastDistributeTime: IDL.Nat,
    positionId: IDL.Nat,
    token0Amount: IDL.Int,
    holder: IDL.Principal,
    token1Amount: IDL.Int,
    tickLower: IDL.Int,
  });
  const Result_17 = IDL.Variant({ ok: Deposit, err: Error });
  const DistributeRecord = IDL.Record({
    rewardTotal: IDL.Nat,
    owner: IDL.Principal,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    rewardGained: IDL.Nat,
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(DistributeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_16 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const FarmStatus = IDL.Variant({
    LIVE: IDL.Null,
    NOT_STARTED: IDL.Null,
    CLOSED: IDL.Null,
    FINISHED: IDL.Null,
  });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const FarmInfo = IDL.Record({
    startTime: IDL.Nat,
    status: FarmStatus,
    creator: IDL.Principal,
    totalRewardHarvested: IDL.Nat,
    numberOfStakes: IDL.Nat,
    rewardToken: Token,
    endTime: IDL.Nat,
    totalRewardBalance: IDL.Nat,
    pool: IDL.Principal,
    refunder: IDL.Principal,
    poolToken0: Token,
    poolToken1: Token,
    poolFee: IDL.Nat,
    totalRewardUnharvested: IDL.Nat,
    totalReward: IDL.Nat,
    userNumberOfStakes: IDL.Nat,
    positionIds: IDL.Vec(IDL.Nat),
  });
  const Result_15 = IDL.Variant({ ok: FarmInfo, err: Error });
  const InitFarmArgs = IDL.Record({
    fee: IDL.Nat,
    startTime: IDL.Nat,
    status: FarmStatus,
    secondPerCycle: IDL.Nat,
    creator: IDL.Principal,
    rewardToken: Token,
    endTime: IDL.Nat,
    pool: IDL.Principal,
    refunder: IDL.Principal,
    governanceCid: IDL.Opt(IDL.Principal),
    priceInsideLimit: IDL.Bool,
    token0AmountLimit: IDL.Nat,
    rewardPool: IDL.Principal,
    token1AmountLimit: IDL.Nat,
    totalReward: IDL.Nat,
    farmFactoryCid: IDL.Principal,
    feeReceiverCid: IDL.Principal,
  });
  const Result_14 = IDL.Variant({ ok: InitFarmArgs, err: Error });
  const Result_13 = IDL.Variant({
    ok: IDL.Record({
      priceInsideLimit: IDL.Bool,
      positionNumLimit: IDL.Nat,
      token0AmountLimit: IDL.Nat,
      token1AmountLimit: IDL.Nat,
    }),
    err: Error,
  });
  const Result_12 = IDL.Variant({
    ok: IDL.Record({
      poolToken0Amount: IDL.Nat,
      totalLiquidity: IDL.Nat,
      poolToken1Amount: IDL.Nat,
    }),
    err: Error,
  });
  const Result_11 = IDL.Variant({
    ok: IDL.Record({
      poolToken0Symbol: IDL.Text,
      poolToken1Symbol: IDL.Text,
      poolToken1Decimals: IDL.Nat,
      poolToken0Decimals: IDL.Nat,
      poolToken0: IDL.Record({
        address: IDL.Text,
        standard: IDL.Text,
      }),
      poolToken1: IDL.Record({
        address: IDL.Text,
        standard: IDL.Text,
      }),
    }),
    err: Error,
  });
  const Result_10 = IDL.Variant({ ok: IDL.Vec(IDL.Nat), err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result_8 = IDL.Variant({
    ok: IDL.Record({
      secondPerCycle: IDL.Nat,
      totalRewardHarvested: IDL.Nat,
      totalRewardBalance: IDL.Nat,
      totalRewardFee: IDL.Nat,
      rewardPerCycle: IDL.Nat,
      totalCycleCount: IDL.Nat,
      totalRewardUnharvested: IDL.Nat,
      currentCycleCount: IDL.Nat,
      totalReward: IDL.Nat,
    }),
    err: Error,
  });
  const TransType = IDL.Variant({
    withdraw: IDL.Null,
    distribute: IDL.Null,
    unstake: IDL.Null,
    stake: IDL.Null,
    harvest: IDL.Null,
  });
  const StakeRecord = IDL.Record({
    to: IDL.Principal,
    transType: TransType,
    from: IDL.Principal,
    liquidity: IDL.Nat,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    amount: IDL.Nat,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(StakeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_7 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const TokenAmount = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat,
    standard: IDL.Text,
  });
  const TVL = IDL.Record({
    rewardToken: TokenAmount,
    poolToken0: TokenAmount,
    poolToken1: TokenAmount,
  });
  const Result_6 = IDL.Variant({ ok: TVL, err: Error });
  const TransferLog = IDL.Record({
    to: IDL.Principal,
    fee: IDL.Nat,
    result: IDL.Text,
    token: Token,
    action: IDL.Text,
    daysFrom19700101: IDL.Nat,
    owner: IDL.Principal,
    from: IDL.Principal,
    fromSubaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    timestamp: IDL.Nat,
    index: IDL.Nat,
    amount: IDL.Nat,
    errorMsg: IDL.Text,
  });
  const Result_5 = IDL.Variant({ ok: IDL.Vec(TransferLog), err: Error });
  const Result_4 = IDL.Variant({ ok: IDL.Vec(Deposit), err: Error });
  const Page = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_3 = IDL.Variant({ ok: Page, err: Error });
  const Result_2 = IDL.Variant({
    ok: IDL.Record({
      poolToken0: TokenAmount,
      poolToken1: TokenAmount,
    }),
    err: Error,
  });
  return IDL.Service({
    clearErrorLog: IDL.Func([], [], []),
    close: IDL.Func([], [Result], []),
    finishManually: IDL.Func([], [Result], []),
    getAdmins: IDL.Func([], [Result_9], ["query"]),
    getCycleInfo: IDL.Func([], [Result_18], []),
    getDeposit: IDL.Func([IDL.Nat], [Result_17], ["query"]),
    getDistributeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_16], ["query"]),
    getErrorLog: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getFarmInfo: IDL.Func([IDL.Text], [Result_15], ["query"]),
    getInitArgs: IDL.Func([], [Result_14], ["query"]),
    getLimitInfo: IDL.Func([], [Result_13], ["query"]),
    getLiquidityInfo: IDL.Func([], [Result_12], ["query"]),
    getPoolMeta: IDL.Func([], [IDL.Record({ sqrtPriceX96: IDL.Nat, tick: IDL.Int })], []),
    getPoolTokenMeta: IDL.Func([], [Result_11], ["query"]),
    getPositionIds: IDL.Func([], [Result_10], ["query"]),
    getPrincipalRecord: IDL.Func([], [Result_9], ["query"]),
    getRewardInfo: IDL.Func([IDL.Vec(IDL.Nat)], [Result_1], ["query"]),
    getRewardMeta: IDL.Func([], [Result_8], ["query"]),
    getRewardTokenBalance: IDL.Func([], [IDL.Nat], []),
    getStakeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_7], ["query"]),
    getTVL: IDL.Func([], [Result_6], ["query"]),
    getTransferLogs: IDL.Func([], [Result_5], ["query"]),
    getUserDeposits: IDL.Func([IDL.Principal], [Result_4], ["query"]),
    getUserRewardBalance: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    getUserRewardBalances: IDL.Func([IDL.Nat, IDL.Nat], [Result_3], ["query"]),
    getUserTVL: IDL.Func([IDL.Principal], [Result_2], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    init: IDL.Func([], [], []),
    removeErrorTransferLog: IDL.Func([IDL.Nat, IDL.Bool], [], []),
    restartManually: IDL.Func([], [Result], []),
    sendRewardManually: IDL.Func([], [Result], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setLimitInfo: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat, IDL.Bool], [], []),
    stake: IDL.Func([IDL.Nat], [Result], []),
    unstake: IDL.Func([IDL.Nat], [Result], []),
    withdraw: IDL.Func([], [Result_1], []),
    withdrawRewardFee: IDL.Func([], [Result], []),
  });
};
