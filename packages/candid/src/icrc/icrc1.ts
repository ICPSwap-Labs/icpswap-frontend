import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}

export interface GetTransactionsRequest { 'start' : bigint, 'length' : bigint }

export interface ArchivedTransactionRange {
  'callback' : [Principal, string],
  'start' : bigint,
  'length' : bigint,
}

export interface Mint {
  'to' : Account,
  'memo' : [] | [Uint8Array],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}

export interface Burn {
  'from' : Account,
  'memo' : [] | [Uint8Array],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}

export interface Transfer {
  'to' : Account,
  'fee' : [] | [bigint],
  'from' : Account,
  'memo' : [] | [Uint8Array],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}

export interface Transaction {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint],
  'timestamp' : bigint,
  'transfer' : [] | [Transfer],
}

export interface GetTransactionsResponse {
  'first_index' : bigint,
  'log_length' : bigint,
  'transactions' : Array<Transaction>,
  'archived_transactions' : Array<ArchivedTransactionRange>,
}

export interface Ledger {
  'get_transactions' : ActorMethod<
    [GetTransactionsRequest],
    GetTransactionsResponse
  >,
  'icrc1_balance_of' : ActorMethod<[Account], Tokens>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_logo' : ActorMethod<[], string>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<
    [],
    Array<{ 'url' : string, 'name' : string }>
  >,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Tokens>,
  'icrc1_transfer' : ActorMethod<
    [
      {
        'to' : Account,
        'fee' : [] | [Tokens],
        'memo' : [] | [Memo],
        'from_subaccount' : [] | [Subaccount],
        'created_at_time' : [] | [Timestamp],
        'amount' : Tokens,
      },
    ],
    TransferResult
  >,
}
export type Memo = Array<number>;
export type Subaccount = Array<number>;
export type Timestamp = bigint;
export type Tokens = bigint;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type TxIndex = bigint;
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Array<number> } |
  { 'Text' : string };
export interface _SERVICE extends Ledger {}
