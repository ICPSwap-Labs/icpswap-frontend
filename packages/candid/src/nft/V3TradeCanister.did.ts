export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const TokenIndex__1 = IDL.Nat32;
  const BuyRequest = IDL.Record({
    nftCid: IDL.Text,
    tokenIndex: TokenIndex__1
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const ResponseResult_6 = IDL.Variant({
    ok: IDL.Tuple(IDL.Text, IDL.Text),
    err: IDL.Text
  });
  const Time = IDL.Int;
  const AccountIdentifier = IDL.Text;
  const OrderInfo = IDL.Record({
    cid: IDL.Text,
    nftCid: IDL.Text,
    tokenIndex: TokenIndex__1,
    hash: IDL.Text,
    link: IDL.Text,
    name: IDL.Text,
    time: Time,
    minter: AccountIdentifier,
    filePath: IDL.Text,
    fileType: IDL.Text,
    seller: AccountIdentifier,
    introduction: IDL.Text,
    royalties: IDL.Nat,
    artistName: IDL.Text,
    price: IDL.Nat
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(OrderInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_5 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const AccountIdentifier__1 = IDL.Text;
  const TokenIndex = IDL.Nat32;
  const TxInfoResponse = IDL.Record({
    cid: IDL.Text,
    nftCid: IDL.Text,
    txFee: IDL.Nat,
    tokenIndex: TokenIndex__1,
    hash: IDL.Text,
    name: IDL.Text,
    time: Time,
    minter: AccountIdentifier,
    settleAmountStatus: IDL.Text,
    royaltiesFeeStatus: IDL.Text,
    royaltiesFee: IDL.Nat,
    filePath: IDL.Text,
    fileType: IDL.Text,
    txFeeStatus: IDL.Text,
    seller: AccountIdentifier,
    txStatus: IDL.Text,
    settleAmount: IDL.Nat,
    buyer: AccountIdentifier,
    price: IDL.Nat
  });
  const Page = IDL.Record({
    content: IDL.Vec(TxInfoResponse),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_4 = IDL.Variant({ ok: Page, err: IDL.Text });
  const ResponseResult_3 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text
  });
  const ResponseResult_2 = IDL.Variant({ ok: OrderInfo, err: IDL.Text });
  const StatResponse = IDL.Record({
    totalVolume: IDL.Nat,
    listSize: IDL.Nat,
    totalTurnover: IDL.Nat,
    avgPrice: IDL.Nat,
    maxPrice: IDL.Nat,
    minPrice: IDL.Nat
  });
  const ResponseResult_1 = IDL.Variant({
    ok: StatResponse,
    err: IDL.Text
  });
  const ResponseResult = IDL.Variant({
    ok: IDL.Tuple(IDL.Bool, IDL.Nat, IDL.Nat, IDL.Nat),
    err: IDL.Text
  });
  const RevokeRequest = IDL.Record({
    nftCid: IDL.Text,
    tokenIndex: TokenIndex__1
  });
  const SaleRequest = IDL.Record({
    nftCid: IDL.Text,
    tokenIndex: TokenIndex__1,
    price: IDL.Nat
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    buy: IDL.Func([BuyRequest], [BoolResult], []),
    cancel: IDL.Func([IDL.Nat32, IDL.Text], [BoolResult], []),
    cancelOrder: IDL.Func([IDL.Nat32], [BoolResult], []),
    checkPayment: IDL.Func([IDL.Text], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], []),
    findCanisterId: IDL.Func([], [ResponseResult_6], []),
    findCanisterRecommend: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_5], ["query"]),
    findOrderPage: IDL.Func(
      [
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(AccountIdentifier__1),
        IDL.Opt(TokenIndex),
        IDL.Nat,
        IDL.Nat,
        IDL.Text,
        IDL.Bool
      ],
      [ResponseResult_5],
      ["query"]
    ),
    findRecommend: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_5], ["query"]),
    findTokenOrderPage: IDL.Func(
      [TokenIndex, IDL.Text, IDL.Nat, IDL.Nat, IDL.Text, IDL.Bool],
      [ResponseResult_5],
      ["query"]
    ),
    findTokenTxPage: IDL.Func(
      [TokenIndex, IDL.Text, IDL.Nat, IDL.Nat, IDL.Text, IDL.Bool],
      [ResponseResult_4],
      ["query"]
    ),
    findTxPage: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(TokenIndex), IDL.Nat, IDL.Nat, IDL.Text, IDL.Bool],
      [ResponseResult_4],
      ["query"]
    ),
    findUserTxPage: IDL.Func(
      [AccountIdentifier__1, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat, IDL.Text, IDL.Bool],
      [ResponseResult_4],
      ["query"]
    ),
    getAddress: IDL.Func([], [IDL.Text], ["query"]),
    getAdminList: IDL.Func([], [ResponseResult_3], ["query"]),
    getOrder: IDL.Func([IDL.Text, TokenIndex], [ResponseResult_2], ["query"]),
    getStat: IDL.Func([], [ResponseResult_1], ["query"]),
    getTradeState: IDL.Func([], [ResponseResult], ["query"]),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    removeList: IDL.Func([], [BoolResult], []),
    revoke: IDL.Func([RevokeRequest], [BoolResult], []),
    sale: IDL.Func([SaleRequest], [BoolResult], []),
    setCanisterId: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [BoolResult], []),
    setState: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [BoolResult], []),
    setTradeState: IDL.Func([IDL.Bool], [BoolResult], []),
    unlock: IDL.Func([IDL.Text, TokenIndex], [BoolResult], [])
  });
};
