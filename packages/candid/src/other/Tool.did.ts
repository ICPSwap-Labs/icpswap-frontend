export const idlFactory = ({ IDL }: any) => {
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const TokenBalance = IDL.Record({
    token: IDL.Principal,
    balance: IDL.Float64,
  });
  const WalletBalance = IDL.Record({
    user: IDL.Principal,
    tokens: IDL.Vec(TokenBalance),
    totalBalance: IDL.Float64,
  });
  const Result_1 = IDL.Variant({ ok: WalletBalance, err: IDL.Text });
  const UserWalletInfo = IDL.Record({
    user: IDL.Text,
    tokens: IDL.Vec(TokenBalance),
  });
  const Page = IDL.Record({
    content: IDL.Vec(UserWalletInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: Page, err: IDL.Text });
  const UserWallet = IDL.Record({
    user: IDL.Principal,
    tokens: IDL.Vec(TokenBalance),
  });
  const UploadRequests = IDL.Record({ userWallets: IDL.Vec(UserWallet) });
  return IDL.Service({
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_2], ["query"]),
    getUSDPrice: IDL.Func([IDL.Principal], [IDL.Float64], []),
    getUserTokens: IDL.Func([IDL.Principal], [Result_1], ["query"]),
    queryUserTokens: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    uploadUserWallet: IDL.Func([UploadRequests], [IDL.Bool], []),
  });
};
