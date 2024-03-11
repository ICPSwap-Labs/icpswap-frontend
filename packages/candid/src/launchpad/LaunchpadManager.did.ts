export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const ResponseResult_3 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const CanisterView = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    cycle: IDL.Nat
  });
  const ResponseResult_7 = IDL.Variant({
    ok: IDL.Vec(CanisterView),
    err: IDL.Text
  });
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
  const ResponseResult_1 = IDL.Variant({ ok: Property, err: IDL.Text });
  const ResponseResult_5 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const TokenInfo = IDL.Record({
    logo: IDL.Text,
    name: IDL.Text,
    quantity: IDL.Text,
    symbol: IDL.Text
  });
  const TokenViewSet = IDL.Record({
    token: IDL.Record({ info: TokenInfo, transFee: IDL.Nat }),
    wicp: IDL.Record({ info: TokenInfo, transFee: IDL.Nat })
  });
  const TokenSet = IDL.Record({ token: TokenInfo, wicp: TokenInfo });
  const Investor = IDL.Record({
    id: IDL.Text,
    finalTokenSet: IDL.Opt(TokenSet),
    principal: IDL.Principal,
    participatedDateTime: Time,
    expectedDepositedWICPQuantity: IDL.Text,
    withdrawalDateTime: IDL.Opt(Time),
    expectedBuyTokenQuantity: IDL.Text
  });
  const ResponseResult_6 = IDL.Variant({ ok: Investor, err: IDL.Text });
  const ResponseResult = IDL.Variant({ ok: TokenSet, err: IDL.Text });
  const LaunchpadCanister = IDL.Service({
    addInvestor: IDL.Func([IDL.Text], [BoolResult], []),
    addInvestorAddress: IDL.Func([IDL.Text], [], []),
    appendWICPQuantity: IDL.Func([IDL.Text], [BoolResult], []),
    computeFinalTokenViewSet: IDL.Func([IDL.Nat, IDL.Nat], [TokenViewSet], []),
    getInvestorDetail: IDL.Func([IDL.Text], [ResponseResult_6], ["query"]),
    getInvestors: IDL.Func([], [IDL.Vec(Investor)], ["query"]),
    getInvestorsSize: IDL.Func([], [IDL.Nat], ["query"]),
    getWICPQuantity: IDL.Func([], [ResponseResult_5], ["query"]),
    install: IDL.Func([Property, IDL.Text, IDL.Vec(IDL.Text)], [BoolResult], []),
    transferByAddress: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
    uninstall: IDL.Func([], [BoolResult], []),
    withdraw2Investor: IDL.Func([], [ResponseResult], [])
  });
  const TicketPackage = IDL.Record({ cid: IDL.Text, ticket: IDL.Text });
  const ResponseResult_4 = IDL.Variant({
    ok: TicketPackage,
    err: IDL.Text
  });
  const Page = IDL.Record({
    content: IDL.Vec(IDL.Text),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_2 = IDL.Variant({ ok: Page, err: IDL.Text });
  const LaunchpadManager = IDL.Service({
    archive: IDL.Func([], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    generateTicket: IDL.Func([IDL.Text], [ResponseResult_3], []),
    getCanisters: IDL.Func([], [ResponseResult_7], ["query"]),
    getDetail: IDL.Func([], [ResponseResult_1], []),
    getInvestorsSize: IDL.Func([], [ResponseResult_5], []),
    getLaunchpadCanisters: IDL.Func([], [IDL.Vec(LaunchpadCanister)], ["query"]),
    getTicketPackage: IDL.Func([IDL.Text, IDL.Text], [ResponseResult_4], ["query"]),
    getWICPQuantity: IDL.Func([], [ResponseResult_3], []),
    getWhitelist: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_2], ["query"]),
    getWhitelistSize: IDL.Func([], [IDL.Nat], ["query"]),
    inWhitelist: IDL.Func([IDL.Text], [BoolResult], ["query"]),
    install: IDL.Func([IDL.Principal, Property, IDL.Vec(IDL.Text)], [ResponseResult_1], []),
    setController: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    settle: IDL.Func([], [BoolResult], []),
    uninstall: IDL.Func([], [BoolResult], []),
    withdraw: IDL.Func([], [ResponseResult], [])
  });
  return LaunchpadManager;
};
