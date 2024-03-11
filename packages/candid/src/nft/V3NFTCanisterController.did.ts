export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const AccountIdentifier = IDL.Text;
  const KVPair = IDL.Record({ k: IDL.Text, v: IDL.Text });
  const CanisterInfo = IDL.Record({
    cid: IDL.Text,
    creator: AccountIdentifier,
    linkMap: IDL.Vec(KVPair),
    ownerName: IDL.Text,
    owner: AccountIdentifier,
    name: IDL.Text,
    createTime: IDL.Int,
    totalSupply: IDL.Nat,
    introduction: IDL.Text,
    mintSupply: IDL.Nat,
    royalties: IDL.Nat,
    image: IDL.Text
  });
  const ResponseResult_5 = IDL.Variant({
    ok: CanisterInfo,
    err: IDL.Text
  });
  const CanisterRequest = IDL.Record({
    linkMap: IDL.Vec(KVPair),
    ownerName: IDL.Text,
    name: IDL.Text,
    introduction: IDL.Text,
    royalties: IDL.Nat,
    image: IDL.Text
  });
  const TextResult = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const ResponseResult = IDL.Variant({
    ok: IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Text, IDL.Text),
    err: IDL.Text
  });
  const PageResponse = IDL.Record({
    content: IDL.Vec(CanisterInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_2 = IDL.Variant({
    ok: PageResponse,
    err: IDL.Text
  });
  const ResponseResult_4 = IDL.Variant({
    ok: IDL.Tuple(IDL.Nat, IDL.Text, IDL.Text, IDL.Text),
    err: IDL.Text
  });
  const Page = IDL.Record({
    content: IDL.Vec(CanisterInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_3 = IDL.Variant({ ok: Page, err: IDL.Text });
  const ResponseResult_1 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text
  });
  return IDL.Service({
    add: IDL.Func([IDL.Text, IDL.Nat], [NatResult], []),
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    canisterInfo: IDL.Func([IDL.Text], [ResponseResult_5], ["query"]),
    create: IDL.Func([CanisterRequest], [TextResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], []),
    delete: IDL.Func([IDL.Text], [BoolResult], []),
    deleteTradeStatCanister: IDL.Func([IDL.Text], [BoolResult], []),
    feeInfo: IDL.Func([], [ResponseResult], ["query"]),
    findCanister: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_2], ["query"]),
    findCanisterConfig: IDL.Func([], [ResponseResult_4], ["query"]),
    findTop5Canister: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    findUserCanister: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_2], ["query"]),
    getAdminList: IDL.Func([], [ResponseResult_1], ["query"]),
    initLogo: IDL.Func([], [BoolResult], []),
    insert: IDL.Func([CanisterInfo], [NatResult], []),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    setCanisterConfig: IDL.Func(
      [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat32],
      [BoolResult],
      []
    ),
    setFeeInfo: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Text], [ResponseResult], []),
    setLogo: IDL.Func([IDL.Text, IDL.Text], [BoolResult], [])
  });
};
