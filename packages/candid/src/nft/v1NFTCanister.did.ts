export default ({ IDL }: any) => {
  const List = IDL.Rec();
  const TokenIndex = IDL.Nat;
  const User = IDL.Text;
  const SendBatchRequest = IDL.Record({
    tokens: IDL.Vec(TokenIndex),
    users: IDL.Vec(User)
  });
  const AllowanceRequest = IDL.Record({
    token: TokenIndex,
    owner: User,
    spender: User
  });
  const Balance__1 = IDL.Nat;
  const Result_2 = IDL.Variant({ ok: Balance__1, err: IDL.Text });
  const Balance = IDL.Nat;
  const ApproveRequest = IDL.Record({
    token: TokenIndex,
    allowance: Balance,
    spender: User
  });
  const Result_6 = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const BalanceRequest = IDL.Record({ token: TokenIndex, user: User });
  const BalanceResponseV2 = IDL.Variant({ ok: Balance, err: IDL.Text });
  const TokenIndex__1 = IDL.Nat;
  const Result_7 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const ClaimRequest = IDL.Record({ code: IDL.Text, email: IDL.Text });
  const User__1 = IDL.Text;
  const KVPair = IDL.Record({ k: IDL.Text, v: IDL.Text });
  const TokenMetadataV2 = IDL.Record({
    cId: IDL.Text,
    tokenId: IDL.Nat,
    owner: User,
    link: IDL.Text,
    name: IDL.Text,
    minter: User,
    filePath: IDL.Text,
    fileType: IDL.Text,
    mintTime: IDL.Int,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    artistName: IDL.Text
  });
  const PageResponse_1 = IDL.Record({
    content: IDL.Vec(TokenMetadataV2),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_5 = IDL.Variant({ ok: PageResponse_1, err: IDL.Text });
  const Memo = IDL.Text;
  const TxType = IDL.Variant({
    handsel: IDL.Null,
    mint: IDL.Null,
    transaction: IDL.Null
  });
  const TransferRecordV2 = IDL.Record({
    to: User,
    tokenId: TokenIndex,
    from: User,
    memo: Memo,
    time: IDL.Int,
    tokenName: IDL.Text,
    txType: TxType,
    caller: User,
    price: Balance,
    amount: Balance
  });
  const PageResponse = IDL.Record({
    content: IDL.Vec(TransferRecordV2),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const Result_4 = IDL.Variant({ ok: PageResponse, err: IDL.Text });
  const NftHolderInfo = IDL.Record({
    bronze: IDL.Nat,
    gold: IDL.Nat,
    iron: IDL.Nat,
    platinum: IDL.Nat,
    silver: IDL.Nat,
    roseGold: IDL.Nat
  });
  const NftStatInfo = IDL.Record({
    holderAmount: IDL.Nat,
    userMintAmount: IDL.Nat,
    officialMintAmount: IDL.Nat,
    totalMintAmount: IDL.Nat
  });
  const EmailCode = IDL.Record({
    token: TokenIndex,
    code: IDL.Text,
    email: IDL.Text
  });
  const EmailCodeRequest = IDL.Record({ emailCode: IDL.Vec(EmailCode) });
  const Result_3 = IDL.Variant({ ok: TokenMetadataV2, err: IDL.Text });
  const MintRequestV2 = IDL.Record({
    owner: User,
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
  const Result_1 = IDL.Variant({ ok: TokenIndex__1, err: IDL.Text });
  const MintRequestsV2 = IDL.Record({
    owner: User,
    link: IDL.Text,
    name: IDL.Text,
    count: IDL.Nat,
    filePath: IDL.Text,
    fileType: IDL.Text,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    image: IDL.Text,
    artistName: IDL.Text
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Text, List)));
  const EmailState = IDL.Record({
    result: List,
    total: IDL.Nat,
    claimCount: IDL.Nat,
    emailCodeCount: IDL.Nat
  });
  const Result = IDL.Variant({
    ok: IDL.Tuple(IDL.Nat, IDL.Nat),
    err: IDL.Text
  });
  const TransferRequest = IDL.Record({
    to: User,
    token: TokenIndex,
    from: User,
    memo: Memo,
    amount: Balance
  });
  const TransferResponseV2 = IDL.Variant({ ok: Balance, err: IDL.Text });
  return IDL.Service({
    airdrop: IDL.Func([SendBatchRequest], [IDL.Bool, IDL.Text], []),
    allowState: IDL.Func([IDL.Nat, IDL.Bool], [], []),
    allowable: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Bool, IDL.Bool, IDL.Nat], ["query"]),
    allowance: IDL.Func([AllowanceRequest], [Result_2], ["query"]),
    approve: IDL.Func([ApproveRequest], [Result_6], []),
    balance: IDL.Func([BalanceRequest], [BalanceResponseV2], ["query"]),
    bearer: IDL.Func([TokenIndex__1], [Result_7], ["query"]),
    claim: IDL.Func([ClaimRequest], [Result_6], []),
    cycleAvailable: IDL.Func([], [IDL.Nat], []),
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    findSeriesType: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    findTokenList: IDL.Func([User__1, IDL.Nat, IDL.Nat], [Result_5], ["query"]),
    findTokenMarket: IDL.Func([IDL.Vec(IDL.Text), IDL.Nat, IDL.Nat], [Result_5], ["query"]),
    findTokenTxRecord: IDL.Func([User__1, IDL.Nat, IDL.Nat], [Result_4], ["query"]),
    findTxRecord: IDL.Func([TokenIndex__1, IDL.Nat, IDL.Nat], [Result_4], ["query"]),
    getNftHolderInfo: IDL.Func([], [NftHolderInfo], ["query"]),
    getNftStat: IDL.Func([], [NftStatInfo], ["query"]),
    initEmailCode: IDL.Func([EmailCodeRequest], [], ["oneway"]),
    metadata: IDL.Func([TokenIndex__1], [Result_3], ["query"]),
    mint: IDL.Func([MintRequestV2], [Result_1], []),
    mintNFT: IDL.Func([MintRequestV2], [Result_1], []),
    mintNFTs: IDL.Func([MintRequestsV2], [Result_1], []),
    mint_batch: IDL.Func([MintRequestsV2], [Result_1], []),
    ownerNFTCount: IDL.Func([User__1], [BalanceResponseV2], ["query"]),
    queryEmailState: IDL.Func([IDL.Nat, IDL.Nat], [EmailState], ["query"]),
    setClaimState: IDL.Func([IDL.Nat, IDL.Bool], [], []),
    setSeriesType: IDL.Func([IDL.Text, IDL.Bool], [], []),
    supply: IDL.Func([], [Result_2], ["query"]),
    swapMint: IDL.Func([MintRequestV2, IDL.Principal], [Result_1], []),
    tokenHolds: IDL.Func([IDL.Text], [Result], ["query"]),
    transfer: IDL.Func([TransferRequest], [TransferResponseV2], [])
  });
};
