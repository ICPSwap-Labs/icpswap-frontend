import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export interface AllowanceRequest {
  'token' : TokenIdentifier,
  'owner' : User,
  'spender' : Principal,
}
export interface ApproveAllRequest { 'approved' : boolean, 'spender' : User }
export interface ApproveRequest {
  'token' : TokenIdentifier,
  'subaccount' : [] | [SubAccount],
  'allowance' : Balance,
  'spender' : Principal,
}
export type Balance = bigint;
export interface BalanceRequest { 'token' : TokenIdentifier, 'user' : User }
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError };
export interface CanisterInfo {
  'cid' : string,
  'creator' : AccountIdentifier,
  'linkMap' : Array<KVPair__1>,
  'ownerName' : string,
  'owner' : AccountIdentifier,
  'name' : string,
  'createTime' : bigint,
  'totalSupply' : bigint,
  'introduction' : string,
  'mintSupply' : bigint,
  'royalties' : bigint,
  'image' : string,
}
export interface Chunk { 'content' : Array<number>, 'batch_id' : bigint }
export type CommonError = { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export interface CycleInfo { 'balance' : bigint, 'available' : bigint }
export type Error = { 'CommonError' : null } |
  { 'InternalError' : string } |
  { 'UnsupportedToken' : string } |
  { 'InsufficientFunds' : null };
export type Extension = string;
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface KVPair { 'k' : string, 'v' : string }
export interface KVPair__1 { 'k' : string, 'v' : string }
export interface Listing {
  'locked' : [] | [Time],
  'seller' : Principal,
  'price' : bigint,
}
export type Memo = Array<number>;
export type Metadata = {
    'fungible' : {
      'decimals' : number,
      'ownerAccount' : AccountIdentifier,
      'metadata' : [] | [Array<number>],
      'name' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Array<number>] } };
export interface MintRequest {
  'owner' : User,
  'metadata' : [] | [Array<number>],
  'link' : string,
  'name' : string,
  'filePath' : string,
  'fileType' : string,
  'introduction' : string,
  'attributes' : Array<KVPair>,
  'royalties' : bigint,
  'nftType' : string,
  'image' : string,
  'artistName' : string,
}
export interface Page {
  'content' : Array<TransferRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<TokenMetadata>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface QueryPositionResult {
  'fee' : bigint,
  'tickUpper' : bigint,
  'feeGrowthInside1LastX128' : bigint,
  'pool' : string,
  'liquidity' : bigint,
  'feeGrowthInside0LastX128' : bigint,
  'positionId' : string,
  'token0' : Token,
  'token1' : Token,
  'tickLower' : bigint,
}
export type Remark = string;
export type Result = {
    'ok' : Array<[TokenIndex, [] | [Listing], [] | [Array<number>]]>
  } |
  { 'err' : CommonError };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_10 = { 'ok' : Array<string> } |
  { 'err' : string };
export type Result_11 = { 'ok' : [bigint, bigint] } |
  { 'err' : string };
export type Result_12 = { 'ok' : CycleInfo } |
  { 'err' : Error };
export type Result_13 = { 'ok' : CanisterInfo } |
  { 'err' : string };
export type Result_14 = { 'ok' : Page } |
  { 'err' : string };
export type Result_15 = { 'ok' : Page_1 } |
  { 'err' : string };
export type Result_16 = { 'ok' : string } |
  { 'err' : CommonError };
export type Result_17 = { 'ok' : bigint } |
  { 'err' : CommonError };
export type Result_2 = { 'ok' : Balance } |
  { 'err' : CommonError };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_4 = { 'ok' : QueryPositionResult } |
  { 'err' : string };
export type Result_5 = { 'ok' : Balance } |
  { 'err' : string };
export type Result_6 = { 'ok' : TokenIndex } |
  { 'err' : string };
export type Result_7 = { 'ok' : Metadata } |
  { 'err' : CommonError };
export type Result_8 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_9 = { 'ok' : TokenMetadata } |
  { 'err' : string };
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export type SubAccount = Array<number>;
export interface SwapNFT {
  'allowance' : ActorMethod<[AllowanceRequest], Result_17>,
  'approve' : ActorMethod<[ApproveRequest], undefined>,
  'approveForAll' : ActorMethod<[ApproveAllRequest], Result_3>,
  'balance' : ActorMethod<[BalanceRequest], BalanceResponse>,
  'bearer' : ActorMethod<[TokenIdentifier], Result_16>,
  'checkOperator' : ActorMethod<[string, string, string], boolean>,
  'chunkSize' : ActorMethod<[], bigint>,
  'clearChunk' : ActorMethod<[], boolean>,
  'commit_batch' : ActorMethod<
    [
      {
        'batch_id' : bigint,
        'content_type' : string,
        'chunk_ids' : Array<bigint>,
      },
    ],
    undefined
  >,
  'create_batch' : ActorMethod<[], { 'batch_id' : bigint }>,
  'create_chunk' : ActorMethod<[Chunk], { 'chunk_id' : bigint }>,
  'deletePool' : ActorMethod<[string], undefined>,
  'extensions' : ActorMethod<[], Array<Extension>>,
  'findRemovedTokenList' : ActorMethod<[User, bigint, bigint], Result_15>,
  'findTokenList' : ActorMethod<[User, bigint, bigint], Result_15>,
  'findTokenListByPool' : ActorMethod<[string, bigint, bigint], Result_15>,
  'findTokenMarket' : ActorMethod<[Array<string>, bigint, bigint], Result_15>,
  'findTokenTxRecord' : ActorMethod<[User, bigint, bigint], Result_14>,
  'findTxRecord' : ActorMethod<[TokenIdentifier, bigint, bigint], Result_14>,
  'getAllowances' : ActorMethod<
    [],
    Array<[TokenIndex, Array<AccountIdentifier>]>
  >,
  'getCanisterInfo' : ActorMethod<[], Result_13>,
  'getCycleInfo' : ActorMethod<[], Result_12>,
  'getMinter' : ActorMethod<[], Principal>,
  'getNftStat' : ActorMethod<[], Result_11>,
  'getRegistry' : ActorMethod<[], Array<[TokenIndex, string]>>,
  'getRemovedPools' : ActorMethod<[], Result_10>,
  'getTokenId' : ActorMethod<[string, string], Result_6>,
  'getTokens' : ActorMethod<[], Array<[TokenIndex, TokenMetadata]>>,
  'getTradeCanisterId' : ActorMethod<[], Result_1>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'http_request_streaming_callback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackHttpResponse
  >,
  'icsMetadata' : ActorMethod<[TokenIndex], Result_9>,
  'initNFTCanisterInfo' : ActorMethod<
    [CanisterInfo, TokenIndex, string],
    Result_1
  >,
  'isApproveForAll' : ActorMethod<[string, string], Result_3>,
  'isApproveForToken' : ActorMethod<[TokenIndex, string, string], Result_8>,
  'maxFileSize' : ActorMethod<[bigint], Result_1>,
  'metadata' : ActorMethod<[TokenIdentifier], Result_7>,
  'mint' : ActorMethod<[MintRequest], Result_6>,
  'ownerNFTCount' : ActorMethod<[User], Result_5>,
  'positions' : ActorMethod<[TokenIndex], Result_4>,
  'removeAllApproval' : ActorMethod<[ApproveAllRequest], Result_3>,
  'removeApproval' : ActorMethod<[ApproveRequest], Result_3>,
  'removePool' : ActorMethod<[string], undefined>,
  'setLogo' : ActorMethod<[string], Result_3>,
  'setMinter' : ActorMethod<[Principal], undefined>,
  'setTradeCanisterId' : ActorMethod<[[] | [string]], Result_3>,
  'spenderRemoveApproval' : ActorMethod<[TokenIdentifier], Result_3>,
  'supply' : ActorMethod<[TokenIdentifier], Result_2>,
  'tokenURI' : ActorMethod<[bigint], Result_1>,
  'tokens_ext' : ActorMethod<[AccountIdentifier], Result>,
  'transfer' : ActorMethod<[TransferRequest], TransferResponse>,
}
export type Time = bigint;
export interface Token { 'address' : string, 'standard' : string }
export type TokenIdentifier = string;
export type TokenIndex = number;
export interface TokenMetadata {
  'cId' : string,
  'tokenId' : TokenIndex,
  'owner' : AccountIdentifier,
  'metadata' : [] | [Array<number>],
  'link' : string,
  'name' : string,
  'minter' : AccountIdentifier,
  'filePath' : string,
  'fileType' : string,
  'mintTime' : bigint,
  'introduction' : string,
  'attributes' : Array<KVPair>,
  'royalties' : bigint,
  'nftType' : string,
  'artistName' : string,
}
export type TransType = { 'burn' : null } |
  { 'mint' : null } |
  { 'approve' : null } |
  { 'transfer' : null };
export interface TransferRecord {
  'to' : AccountIdentifier,
  'remark' : Remark,
  'tokenId' : TokenIndex,
  'from' : AccountIdentifier,
  'hash' : string,
  'memo' : [] | [Memo],
  'time' : bigint,
  'tokenName' : string,
  'txType' : TransType,
  'caller' : AccountIdentifier,
  'price' : Balance,
  'amount' : Balance,
}
export interface TransferRequest {
  'to' : User,
  'token' : TokenIdentifier,
  'notify' : boolean,
  'from' : User,
  'memo' : Memo,
  'subaccount' : [] | [SubAccount],
  'nonce' : [] | [bigint],
  'amount' : Balance,
}
export type TransferResponse = { 'ok' : Balance } |
  {
    'err' : { 'InsufficientAllowance' : null } |
      { 'CannotNotify' : AccountIdentifier } |
      { 'InsufficientBalance' : null } |
      { 'InvalidToken' : TokenIdentifier } |
      { 'Rejected' : null } |
      { 'Unauthorized' : AccountIdentifier } |
      { 'Other' : string }
  };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE extends SwapNFT {}
