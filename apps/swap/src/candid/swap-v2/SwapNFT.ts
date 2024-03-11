import type { Principal } from "@dfinity/principal";
export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export interface AllowanceRequest {
  token: TokenIdentifier;
  owner: User;
  spender: Principal;
}
export interface ApproveAllRequest {
  approved: boolean;
  spender: User;
}
export interface ApproveRequest {
  token: TokenIdentifier;
  subaccount: [] | [SubAccount];
  allowance: Balance;
  spender: Principal;
}
export type Balance = bigint;
export interface BalanceRequest {
  token: TokenIdentifier;
  user: User;
}
export type BalanceResponse = { ok: Balance } | { err: CommonError__1 };
export type Balance__1 = bigint;
export type BoolResult = { ok: boolean } | { err: string };
export type CommonError =
  | { InsufficientBalance: null }
  | { InvalidToken: TokenIdentifier }
  | { Unauthorized: AccountIdentifier }
  | { Other: string };
export type CommonError__1 =
  | { InsufficientBalance: null }
  | { InvalidToken: TokenIdentifier }
  | { Unauthorized: AccountIdentifier }
  | { Other: string };
export type Extension = string;
export interface IcsMetadata {
  cId: string;
  tokenId: TokenIndex__1;
  owner: AccountIdentifier;
  metadata: [] | [Array<number>];
  link: string;
  name: string;
  minter: AccountIdentifier;
  filePath: string;
  fileType: string;
  mintTime: bigint;
  introduction: string;
  attributes: Array<KVPair__1>;
  royalties: bigint;
  nftType: string;
  artistName: string;
}
export interface IcsMintRequest {
  tokenId: number;
  owner: User;
  metadata: [] | [Array<number>];
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
export interface KVPair {
  k: string;
  v: string;
}
export interface KVPair__1 {
  k: string;
  v: string;
}
export interface Listing {
  locked: [] | [Time];
  seller: Principal;
  price: bigint;
}
export type Memo = Array<number>;
export type Metadata =
  | {
      fungible: {
        decimals: number;
        ownerAccount: AccountIdentifier;
        metadata: [] | [Array<number>];
        name: string;
        symbol: string;
      };
    }
  | { nonfungible: { metadata: [] | [Array<number>] } };
export type NatResult = { ok: bigint } | { err: string };
export interface NftStatInfo {
  holderAmount: bigint;
  userMintAmount: bigint;
  officialMintAmount: bigint;
  totalMintAmount: bigint;
}
export interface Page {
  content: Array<AccountIdentifier__1>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<TransferRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_2 {
  content: Array<IcsMetadata>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Remark = string;
export type ResponseResult = { ok: Page } | { err: string };
export type ResponseResult_1 = { ok: Balance__1 } | { err: string };
export type ResponseResult_2 = { ok: TokenIndex } | { err: string };
export type ResponseResult_3 = { ok: IcsMetadata } | { err: string };
export type ResponseResult_4 = { ok: Array<string> } | { err: string };
export type ResponseResult_5 = { ok: Page_1 } | { err: string };
export type ResponseResult_6 = { ok: Page_2 } | { err: string };
export type ResponseResult_7 = { ok: [string, string] } | { err: string };
export type Result =
  | {
      ok: Array<[TokenIndex, [] | [Listing], [] | [Array<number>]]>;
    }
  | { err: CommonError };
export type Result_1 = { ok: [bigint, bigint] } | { err: string };
export type Result_2 = { ok: Balance__1 } | { err: CommonError };
export type Result_3 = { ok: Metadata } | { err: CommonError };
export type Result_4 = { ok: AccountIdentifier__1 } | { err: CommonError };
export type SubAccount = Array<number>;
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIndex = number;
export type TokenIndex__1 = number;
export type TransType = { burn: null } | { mint: null } | { approve: null } | { transfer: null };
export interface TransferRecord {
  to: AccountIdentifier;
  remark: Remark;
  tokenId: TokenIndex__1;
  from: AccountIdentifier;
  hash: string;
  memo: [] | [Memo];
  time: bigint;
  tokenName: string;
  txType: TransType;
  caller: AccountIdentifier;
  price: Balance;
  amount: Balance;
}
export interface TransferRequest {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount];
  nonce: [] | [bigint];
  amount: Balance;
}
export type TransferResponse =
  | { ok: Balance }
  | {
      err:
        | { InsufficientAllowance: null }
        | { CannotNotify: AccountIdentifier }
        | { InsufficientBalance: null }
        | { InvalidToken: TokenIdentifier }
        | { Rejected: null }
        | { Unauthorized: AccountIdentifier }
        | { Other: string };
    };
export type User = { principal: Principal } | { address: AccountIdentifier };
export type User__1 = { principal: Principal } | { address: AccountIdentifier };
export interface _SERVICE {
  acceptCycles: () => Promise<undefined>;
  addAdmin: (arg_0: AccountIdentifier__1) => Promise<BoolResult>;
  allowance: (arg_0: AllowanceRequest) => Promise<Result_2>;
  approve: (arg_0: ApproveRequest) => Promise<undefined>;
  approveForAll: (arg_0: ApproveAllRequest) => Promise<BoolResult>;
  availableCycles: () => Promise<bigint>;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponse>;
  bearer: (arg_0: TokenIdentifier__1) => Promise<Result_4>;
  cycleAvailable: () => Promise<NatResult>;
  cycleBalance: () => Promise<NatResult>;
  extensions: () => Promise<Array<Extension>>;
  findCanisterId: () => Promise<ResponseResult_7>;
  findMatchNFTLists: (arg_0: User__1, arg_1: Array<KVPair>, arg_2: bigint, arg_3: bigint) => Promise<ResponseResult_6>;
  findTokenList: (arg_0: User__1, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_6>;
  findTokenMarket: (arg_0: Array<string>, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_6>;
  findTokenTxRecord: (arg_0: User__1, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_5>;
  findTxRecord: (arg_0: TokenIdentifier, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_5>;
  getAdminList: () => Promise<ResponseResult_4>;
  getAllowances: () => Promise<Array<[TokenIndex, Array<AccountIdentifier__1>]>>;
  getMinter: () => Promise<Principal>;
  getNftStat: () => Promise<NftStatInfo>;
  getRegistry: () => Promise<Array<[TokenIndex, AccountIdentifier__1]>>;
  getTokens: () => Promise<Array<[TokenIndex, Metadata]>>;
  icsMetadata: (arg_0: TokenIndex) => Promise<ResponseResult_3>;
  isApproveForAll: (arg_0: AccountIdentifier__1, arg_1: AccountIdentifier__1) => Promise<BoolResult>;
  isApproveForToken: (
    arg_0: TokenIndex,
    arg_1: AccountIdentifier__1,
    arg_2: AccountIdentifier__1,
  ) => Promise<ResponseResult_1>;
  metadata: (arg_0: TokenIdentifier__1) => Promise<Result_3>;
  mint: (arg_0: IcsMintRequest, arg_1: User__1) => Promise<ResponseResult_2>;
  ownerNFTCount: (arg_0: User__1) => Promise<ResponseResult_1>;
  queryHolders: (arg_0: bigint, arg_1: bigint) => Promise<ResponseResult>;
  removeAdmin: (arg_0: AccountIdentifier__1) => Promise<BoolResult>;
  removeAllApproval: (arg_0: ApproveAllRequest) => Promise<BoolResult>;
  removeApproval: (arg_0: ApproveRequest) => Promise<BoolResult>;
  setCanisterId: (arg_0: [] | [string], arg_1: [] | [string]) => Promise<BoolResult>;
  setMinter: (arg_0: Principal) => Promise<undefined>;
  setOwner: (arg_0: string) => Promise<undefined>;
  setSwapPositionManager: (arg_0: string) => Promise<undefined>;
  spenderRemoveApproval: (arg_0: TokenIdentifier) => Promise<BoolResult>;
  supply: (arg_0: TokenIdentifier__1) => Promise<Result_2>;
  swapPositionManager: () => Promise<string>;
  tokenHolds: (arg_0: string) => Promise<Result_1>;
  tokens_ext: (arg_0: AccountIdentifier__1) => Promise<Result>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
  updateCanisterImage: (arg_0: string) => Promise<undefined>;
}
