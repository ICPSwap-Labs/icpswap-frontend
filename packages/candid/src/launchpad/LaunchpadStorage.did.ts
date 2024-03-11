export const idlFactory = ({ IDL }: any) => {
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
  const HistoryTransaction = IDL.Record({
    launchpadAddress: IDL.Text,
    time: Time,
    operationType: IDL.Text,
    tokenSymbol: IDL.Text,
    address: IDL.Text,
    quantity: IDL.Text,
    tokenName: IDL.Text,
    managerAddress: IDL.Text
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Page_1 = IDL.Record({
    content: IDL.Vec(HistoryTransaction),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_1 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(Property),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult = IDL.Variant({ ok: Page, err: IDL.Text });
  return IDL.Service({
    addSettledLaunchpad: IDL.Func([Property], [], []),
    addTransaction: IDL.Func([IDL.Text, HistoryTransaction], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getHistoryTransactionsByPage: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_1], ["query"]),
    getSettledLaunchpadsByPage: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult], ["query"])
  });
};
