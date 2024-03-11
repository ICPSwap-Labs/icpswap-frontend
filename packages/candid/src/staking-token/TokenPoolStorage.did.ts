export const idlFactory = ({ IDL }: any) => {
  const TransType = IDL.Variant({
    withdraw: IDL.Null,
    unstaking: IDL.Null,
    staking: IDL.Null,
    endIncentive: IDL.Null,
    claim: IDL.Null,
    unstakeTokenids: IDL.Null,
    deposit: IDL.Null,
    stakeTokenids: IDL.Null,
    createIncentive: IDL.Null
  });
  const Record = IDL.Record({
    to: IDL.Text,
    stakingTokenSymbol: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    tokenId: IDL.Opt(IDL.Nat),
    incentiveCanisterId: IDL.Text,
    stakingToken: IDL.Text,
    rewardToken: IDL.Text,
    stakingStandard: IDL.Text,
    transType: TransType,
    from: IDL.Text,
    pool: IDL.Opt(IDL.Text),
    recipient: IDL.Text,
    rewardStandard: IDL.Text,
    timestamp: IDL.Nat,
    stakingTokenDecimals: IDL.Nat,
    amount: IDL.Nat,
    rewardTokenDecimals: IDL.Nat
  });
  const Page = IDL.Record({
    content: IDL.Vec(Record),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result_1 = IDL.Variant({ ok: CycleInfo, err: Error });
  const StakerStorage = IDL.Service({
    findRewardRecordPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [Result], ["query"]),
    findStakingRecordPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [Result], ["query"]),
    getCycleInfo: IDL.Func([], [Result_1], []),
    getRewardTrans: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    getTrans: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    save: IDL.Func([Record], [], [])
  });
  return StakerStorage;
};
