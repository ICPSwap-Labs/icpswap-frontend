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
export type CommonError = { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type CommonError__1 = { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
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
export interface MintRequest { 'to' : User, 'amount' : Balance }
export interface Page {
  'content' : Array<Transaction>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Page_1 {
  'content' : Array<Holder>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export type Result = { 'ok' : Page } |
  { 'err' : CommonError };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : CommonError };
export type Result_2 = { 'ok' : Balance__1 } |
  { 'err' : CommonError__1 };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : CommonError__1 };
export type Result_4 = { 'ok' : Metadata } |
  { 'err' : CommonError__1 };
export type Result_5 = { 'ok' : string } |
  { 'err' : CommonError__1 };
export type Result_6 = { 'ok' : Page_1 } |
  { 'err' : CommonError };
export type Result_7 = { 'ok' : bigint } |
  { 'err' : CommonError__1 };
export type SubAccount = Array<number>;
export interface Token {
  'allowance' : (arg_0: AllowanceRequest) => Promise<Result_2>,
  'approve' : (arg_0: ApproveRequest) => Promise<Result_3>,
  'balance' : (arg_0: BalanceRequest) => Promise<BalanceResponse>,
  'cycleAvailable' : () => Promise<Result_7>,
  'cycleBalance' : () => Promise<Result_7>,
  'extensions' : () => Promise<Array<Extension>>,
  'getFee' : () => Promise<Result_2>,
  'holders' : (arg_0: HoldersRequest) => Promise<Result_6>,
  'logo' : () => Promise<Result_5>,
  'metadata' : () => Promise<Result_4>,
  'mint' : (arg_0: MintRequest) => Promise<TransferResponse>,
  'registry' : () => Promise<Array<[AccountIdentifier__1, Balance__1]>>,
  'setFee' : (arg_0: Balance__1) => Promise<Result_3>,
  'setFeeTo' : (arg_0: User__1) => Promise<Result_3>,
  'setLogo' : (arg_0: string) => Promise<Result_3>,
  'supply' : () => Promise<Result_2>,
  'totalHolders' : () => Promise<Result_1>,
  'transactions' : (arg_0: TransactionRequest) => Promise<Result>,
  'transfer' : (arg_0: TransferRequest) => Promise<TransferResponse>,
  'transferFrom' : (arg_0: TransferRequest) => Promise<TransferResponse>,
}
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
export interface _SERVICE extends Token {}
