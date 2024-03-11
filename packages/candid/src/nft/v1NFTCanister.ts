export interface AllowanceRequest {
  token: TokenIndex;
  owner: User;
  spender: User;
}
export interface ApproveRequest {
  token: TokenIndex;
  allowance: Balance;
  spender: User;
}
export type Balance = bigint;
export interface BalanceRequest {
  token: TokenIndex;
  user: User;
}
export type BalanceResponseV2 = { ok: Balance } | { err: string };
export type Balance__1 = bigint;
export interface ClaimRequest {
  code: string;
  email: string;
}
export interface EmailCode {
  token: TokenIndex;
  code: string;
  email: string;
}
export interface EmailCodeRequest {
  emailCode: Array<EmailCode>;
}
export interface EmailState {
  result: List;
  total: bigint;
  claimCount: bigint;
  emailCodeCount: bigint;
}
export interface KVPair {
  k: string;
  v: string;
}
export type List = [] | [[string, List]];
export type Memo = string;
export interface MintRequestV2 {
  owner: User;
  link: string;
  name: string;
  filePath: string;
  fileType: string;
  introduction: string;
  attributes: Array<KVPair>;
  royalties: bigint;
  nftType: string;
  image: string;
  artistName: string;
}
export interface MintRequestsV2 {
  owner: User;
  link: string;
  name: string;
  count: bigint;
  filePath: string;
  fileType: string;
  introduction: string;
  attributes: Array<KVPair>;
  royalties: bigint;
  nftType: string;
  image: string;
  artistName: string;
}
export interface NftHolderInfo {
  bronze: bigint;
  gold: bigint;
  iron: bigint;
  platinum: bigint;
  silver: bigint;
  roseGold: bigint;
}
export interface NftStatInfo {
  holderAmount: bigint;
  userMintAmount: bigint;
  officialMintAmount: bigint;
  totalMintAmount: bigint;
}
export interface PageResponse {
  content: Array<User__1>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PageResponse_1 {
  content: Array<TransferRecordV3>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PageResponse_2 {
  content: Array<TransferRecordV2>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PageResponse_3 {
  content: Array<TokenMetadataV2>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: bigint } | { err: string };
export type Result_1 = { ok: [bigint, bigint] } | { err: string };
export type Result_10 = { ok: string } | { err: string };
export type Result_2 = { ok: Balance__1 } | { err: string };
export type Result_3 = { ok: boolean } | { err: string };
export type Result_4 = { ok: TokenIndex__1 } | { err: string };
export type Result_5 = { ok: TokenMetadataV2 } | { err: string };
export type Result_6 = { ok: Array<TransferRecordV3> } | { err: string };
export type Result_7 = { ok: PageResponse_1 } | { err: string };
export type Result_8 = { ok: PageResponse_2 } | { err: string };
export type Result_9 = { ok: PageResponse_3 } | { err: string };
export interface SendBatchRequest {
  tokens: Array<TokenIndex>;
  users: Array<User>;
}
export type TokenIndex = bigint;
export type TokenIndex__1 = bigint;
export interface TokenMetadataV2 {
  cId: string;
  tokenId: bigint;
  owner: User;
  link: string;
  name: string;
  minter: User;
  filePath: string;
  fileType: string;
  mintTime: bigint;
  introduction: string;
  attributes: Array<KVPair>;
  royalties: bigint;
  nftType: string;
  artistName: string;
}
export interface TransferRecordV2 {
  to: User;
  tokenId: TokenIndex;
  from: User;
  memo: Memo;
  time: bigint;
  tokenName: string;
  txType: TxType;
  caller: User;
  price: Balance;
  amount: Balance;
}
export interface TransferRecordV3 {
  to: User;
  tokenId: TokenIndex;
  from: User;
  hash: string;
  memo: Memo;
  time: bigint;
  tokenName: string;
  txType: TxType;
  caller: User;
  price: Balance;
  amount: Balance;
}
export interface TransferRequest {
  to: User;
  token: TokenIndex;
  from: User;
  memo: Memo;
  amount: Balance;
}
export type TransferResponseV2 = { ok: Balance } | { err: string };
export type TxType = { handsel: null } | { mint: null } | { transaction: null };
export type User = string;
export type User__1 = string;
export default interface _SERVICE {
  airdrop: (arg_0: SendBatchRequest) => Promise<[boolean, string]>;
  allowState: (arg_0: bigint, arg_1: boolean) => Promise<undefined>;
  allowable: () => Promise<[bigint, bigint, boolean, boolean, bigint]>;
  allowance: (arg_0: AllowanceRequest) => Promise<Result_2>;
  approve: (arg_0: ApproveRequest) => Promise<Result_3>;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponseV2>;
  bearer: (arg_0: TokenIndex__1) => Promise<Result_10>;
  claim: (arg_0: ClaimRequest) => Promise<Result_3>;
  cycleAvailable: () => Promise<bigint>;
  cycleBalance: () => Promise<bigint>;
  findSeriesType: () => Promise<Array<string>>;
  findTokenList: (arg_0: User__1, arg_1: bigint, arg_2: bigint) => Promise<Result_9>;
  findTokenMarket: (arg_0: Array<string>, arg_1: bigint, arg_2: bigint) => Promise<Result_9>;
  findTokenTxRecord: (arg_0: User__1, arg_1: bigint, arg_2: bigint) => Promise<Result_8>;
  findTxRecord: (arg_0: TokenIndex__1, arg_1: bigint, arg_2: bigint) => Promise<Result_7>;
  findV3Record: (arg_0: TokenIndex__1) => Promise<Result_6>;
  getNftHolderInfo: () => Promise<NftHolderInfo>;
  getNftStat: () => Promise<NftStatInfo>;
  initEmailCode: (arg_0: EmailCodeRequest) => Promise<undefined>;
  metadata: (arg_0: TokenIndex__1) => Promise<Result_5>;
  mint: (arg_0: MintRequestV2) => Promise<Result_4>;
  mintNFT: (arg_0: MintRequestV2) => Promise<Result_4>;
  mintNFTs: (arg_0: MintRequestsV2) => Promise<Result_4>;
  mint_batch: (arg_0: MintRequestsV2) => Promise<Result_4>;
  ownerNFTCount: (arg_0: User__1) => Promise<BalanceResponseV2>;
  queryEmailState: (arg_0: bigint, arg_1: bigint) => Promise<EmailState>;
  queryHolders: (arg_0: bigint, arg_1: bigint) => Promise<PageResponse>;
  setClaimState: (arg_0: bigint, arg_1: boolean) => Promise<undefined>;
  setSeriesType: (arg_0: string, arg_1: boolean) => Promise<undefined>;
  setTxState: (arg_0: boolean) => Promise<Result_3>;
  supply: () => Promise<Result_2>;
  tokenHolds: (arg_0: string) => Promise<Result_1>;
  totalV3Record: () => Promise<Result>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponseV2>;
}
