export const idlFactory = ({ IDL }: any) => {
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
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
  const Page = IDL.Record({
    content: IDL.Vec(UserPool),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: Page, err: Page });
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  return IDL.Service({
    getCycleInfo: IDL.Func([], [Result_2], []),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    queryPool: IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [Result_1], ["query"]),
    updateUser: IDL.Func([IDL.Principal, PublicUserInfo], [Result], []),
  });
};
