export const idlFactory = ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const AllowanceRequest = IDL.Record({
    'token' : TokenIdentifier,
    'owner' : User,
    'spender' : IDL.Principal,
  });
  const Balance__1 = IDL.Nat;
  const CommonError = IDL.Variant({
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : TokenIdentifier,
    'Unauthorized' : AccountIdentifier,
    'Other' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Balance__1, 'err' : CommonError });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Balance = IDL.Nat;
  const ApproveRequest = IDL.Record({
    'token' : TokenIdentifier,
    'subaccount' : IDL.Opt(SubAccount),
    'allowance' : Balance,
    'spender' : IDL.Principal,
  });
  const ApproveAllRequest = IDL.Record({
    'approved' : IDL.Bool,
    'spender' : User,
  });
  const BoolResult = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const BalanceRequest = IDL.Record({
    'token' : TokenIdentifier,
    'user' : User,
  });
  const CommonError__1 = IDL.Variant({
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : TokenIdentifier,
    'Unauthorized' : AccountIdentifier,
    'Other' : IDL.Text,
  });
  const BalanceResponse = IDL.Variant({
    'ok' : Balance,
    'err' : CommonError__1,
  });
  const TokenIdentifier__1 = IDL.Text;
  const AccountIdentifier__1 = IDL.Text;
  const Result_4 = IDL.Variant({
    'ok' : AccountIdentifier__1,
    'err' : CommonError,
  });
  const AccountIdentifier__2 = IDL.Text;
  const KVPair__1 = IDL.Record({ 'k' : IDL.Text, 'v' : IDL.Text });
  const CanisterInfo = IDL.Record({
    'cid' : IDL.Text,
    'creator' : AccountIdentifier__2,
    'linkMap' : IDL.Vec(KVPair__1),
    'ownerName' : IDL.Text,
    'owner' : AccountIdentifier__2,
    'name' : IDL.Text,
    'createTime' : IDL.Int,
    'totalSupply' : IDL.Nat,
    'introduction' : IDL.Text,
    'mintSupply' : IDL.Nat,
    'royalties' : IDL.Nat,
    'image' : IDL.Text,
  });
  const ResponseResult_6 = IDL.Variant({
    'ok' : CanisterInfo,
    'err' : IDL.Text,
  });
  const TokenIndex = IDL.Nat32;
  const TextResult = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Chunk = IDL.Record({
    'content' : IDL.Vec(IDL.Nat8),
    'batch_id' : IDL.Nat,
  });
  const NatResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Extension = IDL.Text;
  const User__1 = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const TokenIndex__1 = IDL.Nat32;
  const KVPair = IDL.Record({ 'k' : IDL.Text, 'v' : IDL.Text });
  const IcsMetadata = IDL.Record({
    'cId' : IDL.Text,
    'tokenId' : TokenIndex__1,
    'owner' : AccountIdentifier,
    'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'link' : IDL.Text,
    'name' : IDL.Text,
    'minter' : AccountIdentifier,
    'filePath' : IDL.Text,
    'fileType' : IDL.Text,
    'mintTime' : IDL.Int,
    'introduction' : IDL.Text,
    'attributes' : IDL.Vec(KVPair),
    'royalties' : IDL.Nat,
    'nftType' : IDL.Text,
    'artistName' : IDL.Text,
  });
  const Page_1 = IDL.Record({
    'content' : IDL.Vec(IcsMetadata),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const ResponseResult_5 = IDL.Variant({ 'ok' : Page_1, 'err' : IDL.Text });
  const Remark = IDL.Text;
  const Memo = IDL.Vec(IDL.Nat8);
  const TransType = IDL.Variant({
    'burn' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const TransferRecord = IDL.Record({
    'to' : AccountIdentifier,
    'remark' : Remark,
    'tokenId' : TokenIndex__1,
    'from' : AccountIdentifier,
    'hash' : IDL.Text,
    'memo' : IDL.Opt(Memo),
    'time' : IDL.Int,
    'tokenName' : IDL.Text,
    'txType' : TransType,
    'caller' : AccountIdentifier,
    'price' : Balance,
    'amount' : Balance,
  });
  const Page = IDL.Record({
    'content' : IDL.Vec(TransferRecord),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const ResponseResult_4 = IDL.Variant({ 'ok' : Page, 'err' : IDL.Text });
  const ResponseResult_3 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'err' : IDL.Text,
  });
  const Metadata = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'ownerAccount' : AccountIdentifier,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken__1 = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken__1,
      'callback' : IDL.Func([], [], []),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken__1),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const ResponseResult_2 = IDL.Variant({
    'ok' : IcsMetadata,
    'err' : IDL.Text,
  });
  const ResponseResult = IDL.Variant({ 'ok' : Balance__1, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : Metadata, 'err' : CommonError });
  const IcsMintRequest = IDL.Record({
    'owner' : User,
    'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'link' : IDL.Text,
    'name' : IDL.Text,
    'filePath' : IDL.Text,
    'fileType' : IDL.Text,
    'introduction' : IDL.Text,
    'attributes' : IDL.Vec(KVPair),
    'royalties' : IDL.Nat,
    'nftType' : IDL.Text,
    'image' : IDL.Text,
    'artistName' : IDL.Text,
  });
  const ResponseResult_1 = IDL.Variant({ 'ok' : TokenIndex, 'err' : IDL.Text });
  const MintRequest = IDL.Record({
    'to' : User,
    'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const IcsMintRequests = IDL.Record({
    'owner' : User,
    'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'link' : IDL.Text,
    'name' : IDL.Text,
    'count' : IDL.Nat,
    'filePath' : IDL.Text,
    'fileType' : IDL.Text,
    'introduction' : IDL.Text,
    'attributes' : IDL.Vec(KVPair),
    'royalties' : IDL.Nat,
    'nftType' : IDL.Text,
    'image' : IDL.Text,
    'artistName' : IDL.Text,
  });
  const Time = IDL.Int;
  const Listing = IDL.Record({
    'locked' : IDL.Opt(Time),
    'seller' : IDL.Principal,
    'price' : IDL.Nat64,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Vec(
      IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))
    ),
    'err' : CommonError,
  });
  const TransferRequest = IDL.Record({
    'to' : User,
    'token' : TokenIdentifier,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : Memo,
    'subaccount' : IDL.Opt(SubAccount),
    'nonce' : IDL.Opt(IDL.Nat),
    'amount' : Balance,
  });
  const TransferResponse = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'InsufficientAllowance' : IDL.Null,
      'CannotNotify' : AccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : TokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : AccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  const NFTDynamicCanister = IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'allowance' : IDL.Func([AllowanceRequest], [Result_1], ['query']),
    'approve' : IDL.Func([ApproveRequest], [], []),
    'approveForAll' : IDL.Func([ApproveAllRequest], [BoolResult], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
    'bearer' : IDL.Func([TokenIdentifier__1], [Result_4], ['query']),
    'canisterInfo' : IDL.Func([], [ResponseResult_6], ['query']),
    'chunkSize' : IDL.Func([], [IDL.Nat], ['query']),
    'clearChunk' : IDL.Func([], [IDL.Bool], []),
    'commit_batch' : IDL.Func(
        [
          IDL.Record({
            'batch_id' : IDL.Nat,
            'content_type' : IDL.Text,
            'chunk_ids' : IDL.Vec(IDL.Nat),
          }),
        ],
        [],
        [],
      ),
    'create' : IDL.Func([CanisterInfo, TokenIndex, IDL.Text], [TextResult], []),
    'create_batch' : IDL.Func([], [IDL.Record({ 'batch_id' : IDL.Nat })], []),
    'create_chunk' : IDL.Func(
        [Chunk],
        [IDL.Record({ 'chunk_id' : IDL.Nat })],
        [],
      ),
    'cycleAvailable' : IDL.Func([], [NatResult], []),
    'cycleBalance' : IDL.Func([], [NatResult], []),
    'extensions' : IDL.Func([], [IDL.Vec(Extension)], ['query']),
    'findCanisterId' : IDL.Func([], [TextResult], []),
    'findTokenList' : IDL.Func(
        [User__1, IDL.Nat, IDL.Nat],
        [ResponseResult_5],
        ['query'],
      ),
    'findTokenMarket' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Nat, IDL.Nat],
        [ResponseResult_5],
        ['query'],
      ),
    'findTokenTxRecord' : IDL.Func(
        [User__1, IDL.Nat, IDL.Nat],
        [ResponseResult_4],
        ['query'],
      ),
    'findTxRecord' : IDL.Func(
        [TokenIdentifier, IDL.Nat, IDL.Nat],
        [ResponseResult_4],
        ['query'],
      ),
    'getAllowances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Vec(AccountIdentifier__1)))],
        ['query'],
      ),
    'getMinter' : IDL.Func([], [IDL.Principal], ['query']),
    'getNftStat' : IDL.Func([], [ResponseResult_3], ['query']),
    'getRegistry' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier__1))],
        ['query'],
      ),
    'getTokens' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex, Metadata))],
        ['query'],
      ),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'http_request_streaming_callback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackHttpResponse],
        ['query'],
      ),
    'icsMetadata' : IDL.Func([TokenIndex], [ResponseResult_2], ['query']),
    'isApproveForAll' : IDL.Func(
        [AccountIdentifier__1, AccountIdentifier__1],
        [BoolResult],
        ['query'],
      ),
    'isApproveForToken' : IDL.Func(
        [TokenIndex, AccountIdentifier__1, AccountIdentifier__1],
        [ResponseResult],
        ['query'],
      ),
    'maxFileSize' : IDL.Func([IDL.Nat], [Result_3], []),
    'metadata' : IDL.Func([TokenIdentifier__1], [Result_2], ['query']),
    'mint' : IDL.Func([IcsMintRequest], [ResponseResult_1], []),
    'mintNFT' : IDL.Func([MintRequest], [TokenIndex], []),
    'mint_batch' : IDL.Func([IcsMintRequests], [ResponseResult_1], []),
    'ownerNFTCount' : IDL.Func([User__1], [ResponseResult], ['query']),
    'removeAllApproval' : IDL.Func([ApproveAllRequest], [BoolResult], []),
    'removeApproval' : IDL.Func([ApproveRequest], [BoolResult], []),
    'setCanisterId' : IDL.Func([IDL.Opt(IDL.Text)], [BoolResult], []),
    'setLogo' : IDL.Func([IDL.Text], [BoolResult], []),
    'setMinter' : IDL.Func([IDL.Principal], [], []),
    'spenderRemoveApproval' : IDL.Func([TokenIdentifier], [BoolResult], []),
    'supply' : IDL.Func([TokenIdentifier__1], [Result_1], ['query']),
    'tokens_ext' : IDL.Func([AccountIdentifier__1], [Result], ['query']),
    'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
  });
  return NFTDynamicCanister;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
