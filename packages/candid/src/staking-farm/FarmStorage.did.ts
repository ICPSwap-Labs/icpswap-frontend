export const idlFactory = ({ IDL }: any) => {
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result_2 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const DistributeRecord = IDL.Record({
    rewardToken: Token,
    rewardTotal: IDL.Nat,
    owner: IDL.Principal,
    farmCid: IDL.Text,
    positionId: IDL.Nat,
    nftId: IDL.Nat,
    timestamp: IDL.Nat,
    rewardGained: IDL.Nat,
    poolCid: IDL.Text
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(DistributeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_1 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const TransType = IDL.Variant({
    claim: IDL.Null,
    distribute: IDL.Null,
    unstake: IDL.Null,
    stake: IDL.Null
  });
  const StakeRecord = IDL.Record({
    to: IDL.Principal,
    rewardToken: Token,
    transType: TransType,
    from: IDL.Principal,
    farmCid: IDL.Text,
    liquidity: IDL.Nat,
    positionId: IDL.Nat,
    nftId: IDL.Nat,
    timestamp: IDL.Nat,
    poolCid: IDL.Text,
    amount: IDL.Nat
  });
  const Page = IDL.Record({
    content: IDL.Vec(StakeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  const Record = IDL.Record({
    to: IDL.Principal,
    rewardToken: Token,
    rewardTotal: IDL.Nat,
    owner: IDL.Principal,
    transType: TransType,
    from: IDL.Principal,
    farmCid: IDL.Text,
    liquidity: IDL.Nat,
    positionId: IDL.Nat,
    nftId: IDL.Nat,
    timestamp: IDL.Nat,
    rewardGained: IDL.Nat,
    poolCid: IDL.Text,
    amount: IDL.Nat
  });
  const FarmStorage = IDL.Service({
    getCycleInfo: IDL.Func([], [Result_2], []),
    getDistributeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_1], ["query"]),
    getStakeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result], ["query"]),
    save: IDL.Func([Record], [], []),
    setFarmCanister: IDL.Func([IDL.Principal], [], [])
  });
  return FarmStorage;
};
