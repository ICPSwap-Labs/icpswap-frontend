export const idlFactory = ({ IDL }: any) => {
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const TransType = IDL.Variant({
    withdraw: IDL.Null,
    liquidate: IDL.Null,
    deposit: IDL.Null,
    unstake: IDL.Null,
    stake: IDL.Null,
    harvest: IDL.Null,
  });
  const TransTokenType = IDL.Variant({
    stakeToken: IDL.Null,
    rewardToken: IDL.Null,
  });
  const Record = IDL.Record({
    to: IDL.Principal,
    stakingTokenSymbol: IDL.Text,
    result: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    transType: TransType,
    from: IDL.Principal,
    transTokenType: TransTokenType,
    errMsg: IDL.Text,
    rewardStandard: IDL.Text,
    timestamp: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    amount: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(Record),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_9 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_8 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Nat, Record)),
    err: Error,
  });
  const PublicUserInfo = IDL.Record({
    pendingReward: IDL.Nat,
    lastRewardTime: IDL.Nat,
    stakeAmount: IDL.Nat,
    rewardTokenBalance: IDL.Nat,
    rewardDebt: IDL.Nat,
    lastStakeTime: IDL.Nat,
    stakeTokenBalance: IDL.Nat,
  });
  const Page = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, PublicUserInfo)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_7 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Result_6 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_5 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const LiquidationStatus = IDL.Variant({
    pending: IDL.Null,
    liquidation: IDL.Null,
    liquidated: IDL.Null,
  });
  const PublicStakingPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    lastRewardTime: IDL.Nat,
    totalDeposit: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Principal,
    stakingToken: Token,
    rewardToken: Token,
    totalUnstaked: IDL.Float64,
    rewardPerTime: IDL.Nat,
    totalHarvest: IDL.Float64,
    name: IDL.Text,
    liquidationStatus: LiquidationStatus,
    createTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardFee: IDL.Nat,
    rewardDebt: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    accPerShare: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    totalStaked: IDL.Float64,
    rewardTokenDecimals: IDL.Nat,
    feeReceiverCid: IDL.Principal,
  });
  const Result_1 = IDL.Variant({
    ok: PublicStakingPoolInfo,
    err: IDL.Text,
  });
  const Result_4 = IDL.Variant({ ok: PublicUserInfo, err: IDL.Text });
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Result_3 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const UpdateStakingPool = IDL.Record({
    startTime: IDL.Nat,
    rewardPerTime: IDL.Nat,
    bonusEndTime: IDL.Nat,
  });
  return IDL.Service({
    claim: IDL.Func([], [Result], []),
    deposit: IDL.Func([], [Result], []),
    depositFrom: IDL.Func([IDL.Nat], [Result], []),
    findRewardRecordPage: IDL.Func([IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat], [Result_9], ["query"]),
    findStakingRecordPage: IDL.Func([IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat], [Result_9], ["query"]),
    findTransferRecord: IDL.Func([], [Result_8], ["query"]),
    findUserInfo: IDL.Func([IDL.Nat, IDL.Nat], [Result_7], ["query"]),
    getAdmins: IDL.Func([], [Result_6], ["query"]),
    getCycleInfo: IDL.Func([], [Result_5], []),
    getPoolInfo: IDL.Func([], [Result_1], ["query"]),
    getUserInfo: IDL.Func([IDL.Principal], [Result_4], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    harvest: IDL.Func([], [Result_2], []),
    liquidation: IDL.Func([], [Result], []),
    pendingReward: IDL.Func([IDL.Principal], [Result_2], ["query"]),
    refundRewardToken: IDL.Func([], [Result], []),
    refundUserToken: IDL.Func([], [Result], []),
    removeTransferRecord: IDL.Func([IDL.Nat, IDL.Bool], [Result_3], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    stake: IDL.Func([], [Result_2], []),
    stop: IDL.Func([], [Result_1], []),
    unclaimdRewardFee: IDL.Func([], [Result_2], ["query"]),
    unstake: IDL.Func([IDL.Nat], [Result_2], []),
    updateStakingPool: IDL.Func([UpdateStakingPool], [Result_1], []),
    withdraw: IDL.Func([IDL.Bool, IDL.Nat], [Result], []),
    withdrawRewardFee: IDL.Func([], [Result], []),
  });
};
