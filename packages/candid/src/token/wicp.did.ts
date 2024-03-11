export const idlFactory = ({ IDL }: any) => {
  const Balance = IDL.Nat;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const AllowanceRequest = IDL.Record({
    owner: User,
    subaccount: IDL.Opt(SubAccount),
    spender: IDL.Principal
  });
  const Balance__1 = IDL.Nat;
  const TokenIdentifier = IDL.Text;
  const CommonError__1 = IDL.Variant({
    InsufficientBalance: IDL.Null,
    InvalidToken: TokenIdentifier,
    Unauthorized: AccountIdentifier,
    Other: IDL.Text
  });
  const Result_4 = IDL.Variant({ ok: Balance__1, err: CommonError__1 });
  const ApproveRequest = IDL.Record({
    subaccount: IDL.Opt(SubAccount),
    allowance: Balance,
    spender: IDL.Principal
  });
  const Result_5 = IDL.Variant({ ok: IDL.Bool, err: CommonError__1 });
  const BalanceRequest = IDL.Record({
    token: TokenIdentifier,
    user: User
  });
  const CommonError = IDL.Variant({
    InsufficientBalance: IDL.Null,
    InvalidToken: TokenIdentifier,
    Unauthorized: AccountIdentifier,
    Other: IDL.Text
  });
  const BalanceResponse = IDL.Variant({ ok: Balance, err: CommonError });
  const Result_10 = IDL.Variant({ ok: IDL.Nat, err: CommonError__1 });
  const Extension = IDL.Text;
  const HoldersRequest = IDL.Record({
    offset: IDL.Opt(IDL.Nat),
    limit: IDL.Opt(IDL.Nat)
  });
  const Holder = IDL.Record({
    balance: IDL.Nat,
    account: AccountIdentifier
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(Holder),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_9 = IDL.Variant({ ok: Page_2, err: CommonError });
  const Result_8 = IDL.Variant({ ok: IDL.Text, err: CommonError__1 });
  const Metadata = IDL.Variant({
    fungible: IDL.Record({
      decimals: IDL.Nat8,
      ownerAccount: AccountIdentifier,
      metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
      name: IDL.Text,
      symbol: IDL.Text
    }),
    nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) })
  });
  const Result_7 = IDL.Variant({ ok: Metadata, err: CommonError__1 });
  const BlockHeight = IDL.Nat64;
  const MintRequest = IDL.Record({ to: User, blockHeight: BlockHeight });
  const Result_6 = IDL.Variant({ ok: IDL.Bool, err: CommonError });
  const AccountIdentifier__1 = IDL.Text;
  const User__1 = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const Result_3 = IDL.Variant({ ok: IDL.Nat, err: CommonError });
  const TransactionRequest = IDL.Record({
    hash: IDL.Opt(IDL.Text),
    user: IDL.Opt(User),
    offset: IDL.Opt(IDL.Nat),
    limit: IDL.Opt(IDL.Nat),
    index: IDL.Opt(IDL.Nat)
  });
  const TransType = IDL.Variant({
    burn: IDL.Null,
    mint: IDL.Null,
    approve: IDL.Null,
    transfer: IDL.Null
  });
  const Transaction = IDL.Record({
    to: AccountIdentifier,
    fee: Balance,
    status: IDL.Text,
    transType: TransType,
    from: AccountIdentifier,
    hash: IDL.Text,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    timestamp: IDL.Int,
    index: IDL.Nat,
    amount: Balance
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(Transaction),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_2 = IDL.Variant({ ok: Page_1, err: CommonError });
  const Memo = IDL.Vec(IDL.Nat8);
  const TransferRequest = IDL.Record({
    to: User,
    token: TokenIdentifier,
    notify: IDL.Bool,
    from: User,
    memo: Memo,
    subaccount: IDL.Opt(SubAccount),
    nonce: IDL.Opt(IDL.Nat),
    amount: Balance
  });
  const TransferResponse = IDL.Variant({
    ok: Balance,
    err: IDL.Variant({
      InsufficientAllowance: IDL.Null,
      CannotNotify: AccountIdentifier,
      InsufficientBalance: IDL.Null,
      InvalidToken: TokenIdentifier,
      Rejected: IDL.Null,
      Unauthorized: AccountIdentifier,
      Other: IDL.Text
    })
  });
  const WithdrawRequest = IDL.Record({ to: User, amount: Balance });
  const BlockHeight__1 = IDL.Nat64;
  const Result_1 = IDL.Variant({ ok: BlockHeight__1, err: CommonError });
  const WrapRequest = IDL.Record({
    user: IDL.Opt(User),
    offset: IDL.Opt(IDL.Nat),
    limit: IDL.Opt(IDL.Nat),
    index: IDL.Opt(IDL.Nat)
  });
  const Date = IDL.Nat64;
  const WrapType = IDL.Variant({ wrap: IDL.Null, unwrap: IDL.Null });
  const WrapRecord = IDL.Record({
    to: AccountIdentifier,
    date: Date,
    from: AccountIdentifier,
    wrapType: WrapType,
    blockHeight: BlockHeight,
    index: IDL.Nat,
    amount: Balance
  });
  const Page = IDL.Record({
    content: IDL.Vec(WrapRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result = IDL.Variant({ ok: Page, err: CommonError });
  const WrapToken = IDL.Service({
    allowance: IDL.Func([AllowanceRequest], [Result_4], ["query"]),
    approve: IDL.Func([ApproveRequest], [Result_5], []),
    balance: IDL.Func([BalanceRequest], [BalanceResponse], ["query"]),
    cycleAvailable: IDL.Func([], [Result_10], []),
    cycleBalance: IDL.Func([], [Result_10], ["query"]),
    extensions: IDL.Func([], [IDL.Vec(Extension)], ["query"]),
    getFee: IDL.Func([], [Result_4], ["query"]),
    holders: IDL.Func([HoldersRequest], [Result_9], ["query"]),
    logo: IDL.Func([], [Result_8], ["query"]),
    metadata: IDL.Func([], [Result_7], ["query"]),
    mint: IDL.Func([MintRequest], [Result_6], []),
    registry: IDL.Func([], [IDL.Vec(IDL.Tuple(AccountIdentifier__1, Balance__1))], ["query"]),
    setFee: IDL.Func([Balance__1], [Result_5], []),
    setFeeTo: IDL.Func([User__1], [Result_5], []),
    setLogo: IDL.Func([IDL.Text], [Result_5], []),
    supply: IDL.Func([], [Result_4], ["query"]),
    totalHolders: IDL.Func([], [Result_3], ["query"]),
    transactions: IDL.Func([TransactionRequest], [Result_2], ["query"]),
    transfer: IDL.Func([TransferRequest], [TransferResponse], []),
    transferFrom: IDL.Func([TransferRequest], [TransferResponse], []),
    withdraw: IDL.Func([WithdrawRequest], [Result_1], []),
    wrappedTx: IDL.Func([WrapRequest], [Result], [])
  });
  return WrapToken;
};
