export const idlFactory = ({ IDL }: any) => {
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const Result_4 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
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
  const Page = IDL.Record({
    content: IDL.Vec(FarmInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_1 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Result = IDL.Variant({
    ok: IDL.Record({
      stakedTokenTVL: IDL.Float64,
      rewardTokenTVL: IDL.Float64
    }),
    err: Error
  });
  const FarmController = IDL.Service({
    addController: IDL.Func([IDL.Principal], [], []),
    addControllersToFarm: IDL.Func([IDL.Principal], [], []),
    clearErrorLog: IDL.Func([], [], []),
    clearunusedCanister: IDL.Func([], [], []),
    create: IDL.Func(
      [Token, IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Bool],
      [Result_4],
      []
    ),
    getControllerList: IDL.Func([], [Result_3], ["query"]),
    getCycleInfo: IDL.Func([], [Result_2], []),
    getErrorLog: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getFarmList: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_1], ["query"]),
    getGlobalTVL: IDL.Func([], [Result], []),
    getUnusedCanister: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    setControllerList: IDL.Func([IDL.Vec(IDL.Principal)], [], [])
  });
  return FarmController;
};
