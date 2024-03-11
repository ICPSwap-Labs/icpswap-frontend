export const idlFactory = ({ IDL }: any) => {
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier
  });
  const AllowanceRequest = IDL.Record({
    token: TokenIdentifier,
    owner: User,
    spender: IDL.Principal
  });
  const CommonError = IDL.Variant({
    InsufficientBalance: IDL.Null,
    InvalidToken: TokenIdentifier,
    Unauthorized: AccountIdentifier,
    Other: IDL.Text
  });
  const Result_17 = IDL.Variant({ ok: IDL.Nat, err: CommonError });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Balance = IDL.Nat;
  const ApproveRequest = IDL.Record({
    token: TokenIdentifier,
    subaccount: IDL.Opt(SubAccount),
    allowance: Balance,
    spender: IDL.Principal
  });
  const ApproveAllRequest = IDL.Record({
    approved: IDL.Bool,
    spender: User
  });
  const Result_3 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const BalanceRequest = IDL.Record({
    token: TokenIdentifier,
    user: User
  });
  const BalanceResponse = IDL.Variant({ ok: Balance, err: CommonError });
  const Result_16 = IDL.Variant({ ok: IDL.Text, err: CommonError });
  const Chunk = IDL.Record({
    content: IDL.Vec(IDL.Nat8),
    batch_id: IDL.Nat
  });
  const Extension = IDL.Text;
  const TokenIndex = IDL.Nat32;
  const KVPair = IDL.Record({ k: IDL.Text, v: IDL.Text });
  const TokenMetadata = IDL.Record({
    cId: IDL.Text,
    tokenId: TokenIndex,
    owner: AccountIdentifier,
    metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    link: IDL.Text,
    name: IDL.Text,
    minter: AccountIdentifier,
    filePath: IDL.Text,
    fileType: IDL.Text,
    mintTime: IDL.Int,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    artistName: IDL.Text
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(TokenMetadata),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_15 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Remark = IDL.Text;
  const Memo = IDL.Vec(IDL.Nat8);
  const TransType = IDL.Variant({
    burn: IDL.Null,
    mint: IDL.Null,
    approve: IDL.Null,
    transfer: IDL.Null
  });
  const TransferRecord = IDL.Record({
    to: AccountIdentifier,
    remark: Remark,
    tokenId: TokenIndex,
    from: AccountIdentifier,
    hash: IDL.Text,
    memo: IDL.Opt(Memo),
    time: IDL.Int,
    tokenName: IDL.Text,
    txType: TransType,
    caller: AccountIdentifier,
    price: Balance,
    amount: Balance
  });
  const Page = IDL.Record({
    content: IDL.Vec(TransferRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_14 = IDL.Variant({ ok: Page, err: IDL.Text });
  const KVPair__1 = IDL.Record({ k: IDL.Text, v: IDL.Text });
  const CanisterInfo = IDL.Record({
    cid: IDL.Text,
    creator: AccountIdentifier,
    linkMap: IDL.Vec(KVPair__1),
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
  const Result_13 = IDL.Variant({ ok: CanisterInfo, err: IDL.Text });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result_12 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Result_11 = IDL.Variant({
    ok: IDL.Tuple(IDL.Nat, IDL.Nat),
    err: IDL.Text
  });
  const Result_10 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const Result_6 = IDL.Variant({ ok: TokenIndex, err: IDL.Text });
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField)
  });
  const StreamingCallbackToken = IDL.Record({
    key: IDL.Text,
    index: IDL.Nat,
    content_encoding: IDL.Text
  });
  const StreamingStrategy = IDL.Variant({
    Callback: IDL.Record({
      token: StreamingCallbackToken,
      callback: IDL.Func([], [], [])
    })
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    streaming_strategy: IDL.Opt(StreamingStrategy),
    status_code: IDL.Nat16
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    token: IDL.Opt(StreamingCallbackToken),
    body: IDL.Vec(IDL.Nat8)
  });
  const Result_9 = IDL.Variant({ ok: TokenMetadata, err: IDL.Text });
  const Result_8 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
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
  const Result_7 = IDL.Variant({ ok: Metadata, err: CommonError });
  const MintRequest = IDL.Record({
    owner: User,
    metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    link: IDL.Text,
    name: IDL.Text,
    filePath: IDL.Text,
    fileType: IDL.Text,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    image: IDL.Text,
    artistName: IDL.Text
  });
  const Result_5 = IDL.Variant({ ok: Balance, err: IDL.Text });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const QueryPositionResult = IDL.Record({
    fee: IDL.Nat,
    tickUpper: IDL.Int,
    feeGrowthInside1LastX128: IDL.Nat,
    pool: IDL.Text,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
    positionId: IDL.Text,
    token0: Token,
    token1: Token,
    tickLower: IDL.Int
  });
  const Result_4 = IDL.Variant({
    ok: QueryPositionResult,
    err: IDL.Text
  });
  const Result_2 = IDL.Variant({ ok: Balance, err: CommonError });
  const Time = IDL.Int;
  const Listing = IDL.Record({
    locked: IDL.Opt(Time),
    seller: IDL.Principal,
    price: IDL.Nat64
  });
  const Result = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))),
    err: CommonError
  });
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
  const SwapNFT = IDL.Service({
    allowance: IDL.Func([AllowanceRequest], [Result_17], ["query"]),
    approve: IDL.Func([ApproveRequest], [], []),
    approveForAll: IDL.Func([ApproveAllRequest], [Result_3], []),
    balance: IDL.Func([BalanceRequest], [BalanceResponse], ["query"]),
    bearer: IDL.Func([TokenIdentifier], [Result_16], ["query"]),
    checkOperator: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    chunkSize: IDL.Func([], [IDL.Nat], ["query"]),
    clearChunk: IDL.Func([], [IDL.Bool], []),
    commit_batch: IDL.Func(
      [
        IDL.Record({
          batch_id: IDL.Nat,
          content_type: IDL.Text,
          chunk_ids: IDL.Vec(IDL.Nat)
        })
      ],
      [],
      []
    ),
    create_batch: IDL.Func([], [IDL.Record({ batch_id: IDL.Nat })], []),
    create_chunk: IDL.Func([Chunk], [IDL.Record({ chunk_id: IDL.Nat })], []),
    deletePool: IDL.Func([IDL.Text], [], []),
    extensions: IDL.Func([], [IDL.Vec(Extension)], ["query"]),
    findRemovedTokenList: IDL.Func([User, IDL.Nat, IDL.Nat], [Result_15], ["query"]),
    findTokenList: IDL.Func([User, IDL.Nat, IDL.Nat], [Result_15], ["query"]),
    findTokenListByPool: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [Result_15], ["query"]),
    findTokenMarket: IDL.Func([IDL.Vec(IDL.Text), IDL.Nat, IDL.Nat], [Result_15], ["query"]),
    findTokenTxRecord: IDL.Func([User, IDL.Nat, IDL.Nat], [Result_14], ["query"]),
    findTxRecord: IDL.Func([TokenIdentifier, IDL.Nat, IDL.Nat], [Result_14], ["query"]),
    getAllowances: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Vec(AccountIdentifier)))], ["query"]),
    getCanisterInfo: IDL.Func([], [Result_13], ["query"]),
    getCycleInfo: IDL.Func([], [Result_12], []),
    getMinter: IDL.Func([], [IDL.Principal], ["query"]),
    getNftStat: IDL.Func([], [Result_11], ["query"]),
    getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Text))], ["query"]),
    getRemovedPools: IDL.Func([], [Result_10], ["query"]),
    getTokenId: IDL.Func([IDL.Text, IDL.Text], [Result_6], ["query"]),
    getTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, TokenMetadata))], ["query"]),
    getTradeCanisterId: IDL.Func([], [Result_1], ["query"]),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    http_request_streaming_callback: IDL.Func([StreamingCallbackToken], [StreamingCallbackHttpResponse], ["query"]),
    icsMetadata: IDL.Func([TokenIndex], [Result_9], ["query"]),
    initNFTCanisterInfo: IDL.Func([CanisterInfo, TokenIndex, IDL.Text], [Result_1], []),
    isApproveForAll: IDL.Func([IDL.Text, IDL.Text], [Result_3], ["query"]),
    isApproveForToken: IDL.Func([TokenIndex, IDL.Text, IDL.Text], [Result_8], ["query"]),
    maxFileSize: IDL.Func([IDL.Nat], [Result_1], []),
    metadata: IDL.Func([TokenIdentifier], [Result_7], ["query"]),
    mint: IDL.Func([MintRequest], [Result_6], []),
    ownerNFTCount: IDL.Func([User], [Result_5], ["query"]),
    positions: IDL.Func([TokenIndex], [Result_4], []),
    removeAllApproval: IDL.Func([ApproveAllRequest], [Result_3], []),
    removeApproval: IDL.Func([ApproveRequest], [Result_3], []),
    removePool: IDL.Func([IDL.Text], [], []),
    setLogo: IDL.Func([IDL.Text], [Result_3], []),
    setMinter: IDL.Func([IDL.Principal], [], []),
    setTradeCanisterId: IDL.Func([IDL.Opt(IDL.Text)], [Result_3], []),
    spenderRemoveApproval: IDL.Func([TokenIdentifier], [Result_3], []),
    supply: IDL.Func([TokenIdentifier], [Result_2], ["query"]),
    tokenURI: IDL.Func([IDL.Nat], [Result_1], []),
    tokens_ext: IDL.Func([AccountIdentifier], [Result], ["query"]),
    transfer: IDL.Func([TransferRequest], [TransferResponse], [])
  });
  return SwapNFT;
};
