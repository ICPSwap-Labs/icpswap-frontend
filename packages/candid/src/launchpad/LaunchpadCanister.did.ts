export const idlFactory = ({ IDL }: any) => {
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
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const TokenSet = IDL.Record({ token: TokenInfo, wicp: TokenInfo });
  const Time = IDL.Int;
  const Investor = IDL.Record({
    id: IDL.Text,
    finalTokenSet: IDL.Opt(TokenSet),
    principal: IDL.Principal,
    participatedDateTime: Time,
    expectedDepositedWICPQuantity: IDL.Text,
    withdrawalDateTime: IDL.Opt(Time),
    expectedBuyTokenQuantity: IDL.Text
  });
  const ResponseResult_2 = IDL.Variant({ ok: Investor, err: IDL.Text });
  const ResponseResult_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
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
  const ResponseResult = IDL.Variant({ ok: TokenSet, err: IDL.Text });
  const LaunchpadCanister = IDL.Service({
    addInvestor: IDL.Func([IDL.Text], [BoolResult], []),
    addInvestorAddress: IDL.Func([IDL.Text], [], []),
    appendWICPQuantity: IDL.Func([IDL.Text], [BoolResult], []),
    computeFinalTokenViewSet: IDL.Func([IDL.Nat, IDL.Nat], [TokenViewSet], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getInvestorDetail: IDL.Func([IDL.Text], [ResponseResult_2], ["query"]),
    getInvestors: IDL.Func([], [IDL.Vec(Investor)], ["query"]),
    getInvestorsSize: IDL.Func([], [IDL.Nat], ["query"]),
    getWICPQuantity: IDL.Func([], [ResponseResult_1], ["query"]),
    install: IDL.Func([Property, IDL.Text, IDL.Vec(IDL.Text)], [BoolResult], []),
    transferByAddress: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
    uninstall: IDL.Func([], [BoolResult], []),
    withdraw2Investor: IDL.Func([], [ResponseResult], [])
  });
  return LaunchpadCanister;
};
