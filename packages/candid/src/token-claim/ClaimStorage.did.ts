export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const ClaimEventInfo = IDL.Record({
    claimEventCreator: IDL.Principal,
    tokenCid: IDL.Text,
    tokenStandard: IDL.Text,
    claimedTokenAmount: IDL.Nat,
    claimEventId: IDL.Text,
    tokenDecimals: IDL.Nat8,
    claimEventStatus: IDL.Nat,
    tokenSymbol: IDL.Text,
    totalUserAmount: IDL.Nat,
    totalTokenAmount: IDL.Nat,
    claimedUserAmount: IDL.Nat,
    tokenName: IDL.Text,
    claimCanisterId: IDL.Text,
    claimEventName: IDL.Text
  });
  const User__1 = IDL.Variant({
    principal: IDL.Principal,
    address: IDL.Text
  });
  const ClaimRecordInfo = IDL.Record({
    claimAmount: IDL.Nat,
    tokenCid: IDL.Text,
    tokenStandard: IDL.Text,
    claimStatus: IDL.Nat,
    claimEventId: IDL.Text,
    tokenDecimals: IDL.Nat8,
    claimTime: IDL.Opt(IDL.Int),
    claimUser: User__1,
    tokenSymbol: IDL.Text,
    tokenName: IDL.Text,
    claimEventName: IDL.Text
  });
  const ResponseResult = IDL.Variant({
    ok: ClaimEventInfo,
    err: IDL.Text
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(ClaimRecordInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_3 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Page_1 = IDL.Record({
    content: IDL.Vec(ClaimEventInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_4 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: IDL.Text
  });
  const ResponseResult_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text
  });
  const ResponseResult_1 = IDL.Variant({
    ok: IDL.Tuple(User, IDL.Text),
    err: IDL.Text
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    addEvent: IDL.Func([ClaimEventInfo], [BoolResult], []),
    addEventRecords: IDL.Func([IDL.Text, IDL.Vec(ClaimRecordInfo)], [BoolResult], []),
    claim: IDL.Func([IDL.Text, IDL.Principal], [ResponseResult], []),
    cycleAvailable: IDL.Func([], [NatResult], ["query"]),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    deleteEvent: IDL.Func([IDL.Text], [BoolResult], []),
    findAllEventRecords: IDL.Func([IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    findAllEvents: IDL.Func([IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [ResponseResult_4], ["query"]),
    findEventRecords: IDL.Func([IDL.Text, IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    findUserEventRecords: IDL.Func(
      [User, IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat],
      [ResponseResult_3],
      ["query"]
    ),
    getAdminList: IDL.Func([], [ResponseResult_2], ["query"]),
    getCanisterPrincipal: IDL.Func([], [ResponseResult_1], ["query"]),
    getEvent: IDL.Func([IDL.Text], [ResponseResult], ["query"]),
    ready: IDL.Func([IDL.Text], [BoolResult], []),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    setStatus: IDL.Func([IDL.Text, IDL.Bool], [BoolResult], []),
    userClaim: IDL.Func([IDL.Text], [ResponseResult], [])
  });
};
