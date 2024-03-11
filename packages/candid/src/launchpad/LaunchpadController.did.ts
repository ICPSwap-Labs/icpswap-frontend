export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Time = IDL.Int;
  const Property = IDL.Record({
    id: IDL.Text,
    cid: IDL.Text,
    receiveTokenDateTime: Time,
    creator: IDL.Text,
    depositDateTime: IDL.Opt(Time),
    createdDateTime: Time,
    expectedFundraisingWICPQuantity: IDL.Text,
    settled: IDL.Opt(IDL.Bool),
    name: IDL.Text,
    extraTokenFee: IDL.Opt(IDL.Nat),
    description: IDL.Text,
    soldQuantity: IDL.Text,
    soldTokenId: IDL.Text,
    withdrawalDateTime: IDL.Opt(Time),
    limitedAmountOnce: IDL.Text,
    endDateTime: Time,
    creatorPrincipal: IDL.Principal,
    soldTokenStandard: IDL.Text,
    fundraisingWICPQuantity: IDL.Opt(IDL.Text),
    depositedQuantity: IDL.Text,
    expectedSellQuantity: IDL.Text,
    startDateTime: Time,
    initialExchangeRatio: IDL.Text
  });
  const ResponseResult_3 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(Property),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_1 = IDL.Variant({ ok: Page, err: IDL.Text });
  const CanisterView = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    cycle: IDL.Nat
  });
  const ResponseResult_2 = IDL.Variant({
    ok: IDL.Vec(CanisterView),
    err: IDL.Text
  });
  const ResponseResult = IDL.Variant({ ok: Property, err: IDL.Text });
  return IDL.Service({
    addWhitelist: IDL.Func([IDL.Vec(IDL.Text)], [IDL.Bool], []),
    archive: IDL.Func([], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    deleteWhitelist: IDL.Func([IDL.Vec(IDL.Text)], [IDL.Bool], []),
    generate: IDL.Func([Property], [ResponseResult_3], []),
    getAllPools: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_1], ["query"]),
    getCanisters: IDL.Func([], [ResponseResult_2], ["query"]),
    getPoolsByOwner: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_1], ["query"]),
    getWhitelist: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    install: IDL.Func([IDL.Text, Property, IDL.Vec(IDL.Text)], [ResponseResult], []),
    result: IDL.Func([], [IDL.Text], []),
    setController: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    uninstall: IDL.Func([], [BoolResult], [])
  });
};
