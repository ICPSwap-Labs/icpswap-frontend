export const idlFactory = ({ IDL }: any) => {
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const TokenDataIndex = IDL.Record({
    marketAmount: IDL.Float64,
    decimals: IDL.Nat,
    ledgerId: IDL.Principal,
    standards: IDL.Text,
    name: IDL.Text,
    transactionAmount: IDL.Nat,
    holders: IDL.Nat,
    symbol: IDL.Text,
    lockedAmount: IDL.Float64,
  });
  const Result_1 = IDL.Variant({ ok: TokenDataIndex, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(TokenDataIndex),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  const UploadRequests = IDL.Record({ tokenDatas: IDL.Vec(TokenDataIndex) });
  return IDL.Service({
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_2], ["query"]),
    getTokenData: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    getUSDPrice: IDL.Func([IDL.Principal], [IDL.Float64], []),
    queryTokenDatas: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    uploadTokenData: IDL.Func([UploadRequests], [IDL.Bool], []),
  });
};
