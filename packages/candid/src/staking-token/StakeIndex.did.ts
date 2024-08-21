export const idlFactory = ({ IDL }: any) => {
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_6 = IDL.Variant({ ok: CycleInfo, err: Error });
  const APRInfo = IDL.Record({
    apr: IDL.Float64,
    day: IDL.Nat,
    rewardPerTime: IDL.Nat,
    time: IDL.Nat,
    stakingPool: IDL.Principal,
    stakingTokenPriceUSD: IDL.Float64,
    rewardTokenPriceUSD: IDL.Float64,
    stakingTokenDecimals: IDL.Nat,
    stakingTokenAmount: IDL.Float64,
    rewardTokenDecimals: IDL.Nat,
  });
  const Result_5 = IDL.Variant({ ok: IDL.Vec(APRInfo), err: IDL.Text });
  const Result_4 = IDL.Variant({
    ok: IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Principal),
    err: IDL.Text,
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
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const UserPool = IDL.Record({
    userInfo: PublicUserInfo,
    stakingToken: Token,
    rewardToken: Token,
    owner: IDL.Principal,
    stakingPool: IDL.Principal,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(UserPool),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_3 = IDL.Variant({ ok: Page_1, err: Page_1 });
  const StakingPoolInfo = IDL.Record({
    stakingTokenSymbol: IDL.Text,
    startTime: IDL.Nat,
    rewardTokenSymbol: IDL.Text,
    creator: IDL.Principal,
    stakingToken: Token,
    rewardToken: Token,
    rewardPerTime: IDL.Nat,
    name: IDL.Text,
    createTime: IDL.Nat,
    stakingTokenFee: IDL.Nat,
    rewardTokenFee: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    bonusEndTime: IDL.Nat,
    rewardTokenDecimals: IDL.Nat,
    canisterId: IDL.Principal,
  });
  const Page = IDL.Record({
    content: IDL.Vec(StakingPoolInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_2 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  return IDL.Service({
    computeStakingPool: IDL.Func([], [Result_1], []),
    getCycleInfo: IDL.Func([], [Result_6], []),
    getUSDPrice: IDL.Func([IDL.Text], [IDL.Float64], []),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    queryAPR: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [Result_5], ["query"]),
    queryIndexInfo: IDL.Func([], [Result_4], ["query"]),
    queryPool: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [Result_3], ["query"]),
    queryStakingPool: IDL.Func([IDL.Nat, IDL.Nat], [Result_2], ["query"]),
    syncStakingPool: IDL.Func([], [Result_1], []),
    updateUser: IDL.Func([IDL.Principal, PublicUserInfo], [Result], []),
  });
};
