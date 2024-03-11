import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export interface AllowanceRequest {
  'owner' : User,
  'subaccount' : [] | [SubAccount],
  'spender' : Principal,
}
export interface ApproveRequest {
  'subaccount' : [] | [SubAccount],
  'allowance' : Balance,
  'spender' : Principal,
}
export type Balance = bigint;
export interface BalanceRequest { 'token' : TokenIdentifier, 'user' : User }
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError };
export type Balance__1 = bigint;
export type BlockHeight = bigint;
export type BlockHeight__1 = bigint;
export type CommonError = { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type CommonError__1 = { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type Date = bigint;
export type Extension = string;
export interface Holder { 'balance' : bigint, 'account' : AccountIdentifier }
export interface HoldersRequest {
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
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
export interface MintRequest { 'to' : User, 'blockHeight' : BlockHeight }
export interface Page {
  'content' : Array<WrapRecord>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<Transaction>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_2 {
  'content' : Array<Holder>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type Result = { 'ok' : Page } |
  { 'err' : CommonError };
export type Result_1 = { 'ok' : BlockHeight__1 } |
  { 'err' : CommonError };
export type Result_10 = { 'ok' : bigint } |
  { 'err' : CommonError__1 };
export type Result_2 = { 'ok' : Page_1 } |
  { 'err' : CommonError };
export type Result_3 = { 'ok' : bigint } |
  { 'err' : CommonError };
export type Result_4 = { 'ok' : Balance__1 } |
  { 'err' : CommonError__1 };
export type Result_5 = { 'ok' : boolean } |
  { 'err' : CommonError__1 };
export type Result_6 = { 'ok' : boolean } |
  { 'err' : CommonError };
export type Result_7 = { 'ok' : Metadata } |
  { 'err' : CommonError__1 };
export type Result_8 = { 'ok' : string } |
  { 'err' : CommonError__1 };
export type Result_9 = { 'ok' : Page_2 } |
  { 'err' : CommonError };
export type SubAccount = Array<number>;
export type TokenIdentifier = string;
export type TransType = { 'burn' : null } |
  { 'mint' : null } |
  { 'approve' : null } |
  { 'transfer' : null };
export interface Transaction {
  'to' : AccountIdentifier,
  'fee' : Balance,
  'status' : string,
  'transType' : TransType,
  'from' : AccountIdentifier,
  'hash' : string,
  'memo' : [] | [Array<number>],
  'timestamp' : bigint,
  'index' : bigint,
  'amount' : Balance,
}
export interface TransactionRequest {
  'hash' : [] | [string],
  'user' : [] | [User],
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
  'index' : [] | [bigint],
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
export type User__1 = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface WithdrawRequest { 'to' : User, 'amount' : Balance }
export interface WrapRecord {
  'to' : AccountIdentifier,
  'date' : Date,
  'from' : AccountIdentifier,
  'wrapType' : WrapType,
  'blockHeight' : BlockHeight,
  'index' : bigint,
  'amount' : Balance,
}
export interface WrapRequest {
  'user' : [] | [User],
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
  'index' : [] | [bigint],
}
export interface WrapToken {
  'allowance' : (arg_0: AllowanceRequest) => Promise<Result_4>,
  'approve' : (arg_0: ApproveRequest) => Promise<Result_5>,
  'balance' : (arg_0: BalanceRequest) => Promise<BalanceResponse>,
  'cycleAvailable' : () => Promise<Result_10>,
  'cycleBalance' : () => Promise<Result_10>,
  'extensions' : () => Promise<Array<Extension>>,
  'getFee' : () => Promise<Result_4>,
  'holders' : (arg_0: HoldersRequest) => Promise<Result_9>,
  'logo' : () => Promise<Result_8>,
  'metadata' : () => Promise<Result_7>,
  'mint' : (arg_0: MintRequest) => Promise<Result_6>,
  'registry' : () => Promise<Array<[AccountIdentifier__1, Balance__1]>>,
  'setFee' : (arg_0: Balance__1) => Promise<Result_5>,
  'setFeeTo' : (arg_0: User__1) => Promise<Result_5>,
  'setLogo' : (arg_0: string) => Promise<Result_5>,
  'supply' : () => Promise<Result_4>,
  'totalHolders' : () => Promise<Result_3>,
  'transactions' : (arg_0: TransactionRequest) => Promise<Result_2>,
  'transfer' : (arg_0: TransferRequest) => Promise<TransferResponse>,
  'transferFrom' : (arg_0: TransferRequest) => Promise<TransferResponse>,
  'withdraw' : (arg_0: WithdrawRequest) => Promise<Result_1>,
  'wrappedTx' : (arg_0: WrapRequest) => Promise<Result>,
}
export type WrapType = { 'wrap' : null } |
  { 'unwrap' : null };
export interface _SERVICE extends WrapToken {}
