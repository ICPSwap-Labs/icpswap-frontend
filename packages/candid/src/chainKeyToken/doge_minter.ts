import type { ActorMethod } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";
import type { Principal } from "@icp-sdk/core/principal";

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export interface CanisterStatusResponse {
  memory_metrics: MemoryMetrics;
  status: CanisterStatusType;
  memory_size: bigint;
  ready_for_migration: boolean;
  version: bigint;
  cycles: bigint;
  settings: DefiniteCanisterSettings;
  query_stats: QueryStats;
  idle_cycles_burned_per_day: bigint;
  module_hash: [] | [Uint8Array | number[]];
  reserved_cycles: bigint;
}
export type CanisterStatusType = { stopped: null } | { stopping: null } | { running: null };
export interface ChangeOutput {
  value: bigint;
  vout: number;
}
export interface ConsolidateUtxosRequest {
  received_at: bigint;
  block_index: bigint;
  address: DogecoinAddress;
  amount: bigint;
}
export interface DefiniteCanisterSettings {
  freezing_threshold: bigint;
  wasm_memory_threshold: bigint;
  environment_variables: Array<environment_variable>;
  controllers: Array<Principal>;
  reserved_cycles_limit: bigint;
  log_visibility: log_visibility;
  wasm_memory_limit: bigint;
  memory_allocation: bigint;
  compute_allocation: bigint;
}
export type DogecoinAddress = { P2pkh: Uint8Array | number[] } | { P2sh: Uint8Array | number[] };
export type EstimateWithdrawalFeeError = { AmountTooHigh: null } | { AmountTooLow: { min_amount: bigint } };
export interface Event {
  timestamp: [] | [bigint];
  payload: EventType;
}
export type EventType =
  | {
      received_utxos: {
        to_account: Account;
        mint_txid: [] | [bigint];
        utxos: Array<Utxo>;
      };
    }
  | { removed_retrieve_doge_request: { block_index: bigint } }
  | {
      sent_transaction: {
        fee: [] | [bigint];
        change_output: [] | [ChangeOutput];
        txid: Uint8Array | number[];
        signed_tx: [] | [Uint8Array | number[]];
        withdrawal_fee: [] | [WithdrawalFee];
        utxos: Array<Utxo>;
        requests: BigUint64Array | bigint[];
        submitted_at: bigint;
      };
    }
  | { init: InitArgs }
  | { upgrade: UpgradeArgs }
  | {
      suspended_utxo: {
        utxo: Utxo;
        account: Account;
        reason: SuspendedReason;
      };
    }
  | { checked_utxo: { utxo: Utxo; account: Account } }
  | { accepted_retrieve_doge_request: RetrieveDogeRequest }
  | {
      schedule_withdrawal_reimbursement: {
        burn_block_index: bigint;
        account: Account;
        amount: bigint;
        reason: WithdrawalReimbursementReason;
      };
    }
  | { quarantined_withdrawal_reimbursement: { burn_block_index: bigint } }
  | { confirmed_transaction: { txid: Uint8Array | number[] } }
  | {
      replaced_transaction: {
        fee: bigint;
        change_output: ChangeOutput;
        new_utxos: [] | [Array<Utxo>];
        old_txid: Uint8Array | number[];
        withdrawal_fee: [] | [WithdrawalFee];
        new_txid: Uint8Array | number[];
        submitted_at: bigint;
        reason: [] | [ReplacedReason];
      };
    }
  | { checked_utxo_mint_unknown: { utxo: Utxo; account: Account } }
  | { created_consolidate_utxos_request: ConsolidateUtxosRequest }
  | {
      reimbursed_withdrawal: {
        burn_block_index: bigint;
        mint_block_index: bigint;
      };
    };
export interface InitArgs {
  get_utxos_cache_expiration_seconds: [] | [bigint];
  retrieve_doge_min_amount: bigint;
  ecdsa_key_name: string;
  mode: Mode;
  ledger_id: Principal;
  max_time_in_queue_nanos: bigint;
  max_num_inputs_in_transaction: [] | [bigint];
  utxo_consolidation_threshold: [] | [bigint];
  doge_network: Network;
  min_confirmations: [] | [number];
  deposit_doge_min_amount: [] | [bigint];
}
export type InvalidTransactionError = {
  too_many_inputs: { max_num_inputs: bigint; num_inputs: bigint };
};
export interface MemoryMetrics {
  wasm_binary_size: bigint;
  wasm_chunk_store_size: bigint;
  canister_history_size: bigint;
  stable_memory_size: bigint;
  snapshots_size: bigint;
  wasm_memory_size: bigint;
  global_memory_size: bigint;
  custom_sections_size: bigint;
}
export type MinterArg = { Upgrade: [] | [UpgradeArgs] } | { Init: InitArgs };
export interface MinterInfo {
  retrieve_doge_min_amount: bigint;
  min_confirmations: number;
  deposit_doge_min_amount: bigint;
}
export type Mode =
  | { RestrictedTo: Array<Principal> }
  | { DepositsRestrictedTo: Array<Principal> }
  | { ReadOnly: null }
  | { GeneralAvailability: null };
export type Network = { Mainnet: null } | { Regtest: null };
export interface PendingUtxo {
  confirmations: number;
  value: bigint;
  outpoint: { txid: Uint8Array | number[]; vout: number };
}
export interface QueryStats {
  response_payload_bytes_total: bigint;
  num_instructions_total: bigint;
  num_calls_total: bigint;
  request_payload_bytes_total: bigint;
}
export interface ReimbursedDeposit {
  account: Account;
  mint_block_index: bigint;
  amount: bigint;
  reason: ReimbursementReason;
}
export type ReimbursementReason =
  | { CallFailed: null }
  | { TaintedDestination: { kyt_fee: bigint; kyt_provider: Principal } };
export interface ReimbursementRequest {
  account: Account;
  amount: bigint;
  reason: ReimbursementReason;
}
export type ReplacedReason =
  | {
      to_cancel: { reason: WithdrawalReimbursementReason };
    }
  | { to_retry: null };
export interface RetrieveDogeOk {
  block_index: bigint;
}
export interface RetrieveDogeRequest {
  received_at: bigint;
  block_index: bigint;
  address: DogecoinAddress;
  reimbursement_account: [] | [Account];
  amount: bigint;
}
export type RetrieveDogeStatus =
  | { Signing: null }
  | { Confirmed: { txid: Uint8Array | number[] } }
  | { Sending: { txid: Uint8Array | number[] } }
  | { AmountTooLow: null }
  | { WillReimburse: ReimbursementRequest }
  | { Unknown: null }
  | { Submitted: { txid: Uint8Array | number[] } }
  | { Reimbursed: ReimbursedDeposit }
  | { Pending: null };
export interface RetrieveDogeWithApprovalArgs {
  from_subaccount: [] | [Uint8Array | number[]];
  address: string;
  amount: bigint;
}
export type RetrieveDogeWithApprovalError =
  | { MalformedAddress: string }
  | { GenericError: { error_message: string; error_code: bigint } }
  | { TemporarilyUnavailable: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { AlreadyProcessing: null }
  | { AmountTooLow: bigint }
  | { InsufficientFunds: { balance: bigint } };
export type SuspendedReason = { ValueTooSmall: null } | { Quarantined: null };
export interface SuspendedUtxo {
  utxo: Utxo;
  earliest_retry: Timestamp;
  reason: SuspendedReason;
}
export type Timestamp = bigint;
export type UpdateBalanceError =
  | {
      GenericError: { error_message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: string }
  | { AlreadyProcessing: null }
  | {
      NoNewUtxos: {
        suspended_utxos: [] | [Array<SuspendedUtxo>];
        required_confirmations: number;
        pending_utxos: [] | [Array<PendingUtxo>];
        current_confirmations: [] | [number];
      };
    };
export interface UpgradeArgs {
  get_utxos_cache_expiration_seconds: [] | [bigint];
  retrieve_doge_min_amount: [] | [bigint];
  mode: [] | [Mode];
  max_time_in_queue_nanos: [] | [bigint];
  max_num_inputs_in_transaction: [] | [bigint];
  utxo_consolidation_threshold: [] | [bigint];
  min_confirmations: [] | [number];
  deposit_doge_min_amount: [] | [bigint];
}
export interface Utxo {
  height: number;
  value: bigint;
  outpoint: { txid: Uint8Array | number[]; vout: number };
}
export type UtxoStatus =
  | { ValueTooSmall: Utxo }
  | { Tainted: Utxo }
  | {
      Minted: {
        minted_amount: bigint;
        block_index: bigint;
        utxo: Utxo;
      };
    }
  | { Checked: Utxo };
export interface WithdrawalFee {
  minter_fee: bigint;
  dogecoin_fee: bigint;
}
export type WithdrawalReimbursementReason = {
  invalid_transaction: InvalidTransactionError;
};
export interface environment_variable {
  value: string;
  name: string;
}
export type log_visibility = { controllers: null } | { public: null } | { allowed_viewers: Array<Principal> };
export interface _SERVICE {
  estimate_withdrawal_fee: ActorMethod<
    [{ amount: [] | [bigint] }],
    { Ok: WithdrawalFee } | { Err: EstimateWithdrawalFeeError }
  >;
  get_canister_status: ActorMethod<[], CanisterStatusResponse>;
  get_doge_address: ActorMethod<
    [
      {
        owner: [] | [Principal];
        subaccount: [] | [Uint8Array | number[]];
      },
    ],
    string
  >;
  get_events: ActorMethod<[{ start: bigint; length: bigint }], Array<Event>>;
  get_known_utxos: ActorMethod<
    [
      {
        owner: [] | [Principal];
        subaccount: [] | [Uint8Array | number[]];
      },
    ],
    Array<Utxo>
  >;
  get_minter_info: ActorMethod<[], MinterInfo>;
  retrieve_doge_status: ActorMethod<[{ block_index: bigint }], RetrieveDogeStatus>;
  retrieve_doge_with_approval: ActorMethod<
    [RetrieveDogeWithApprovalArgs],
    { Ok: RetrieveDogeOk } | { Err: RetrieveDogeWithApprovalError }
  >;
  update_balance: ActorMethod<
    [
      {
        owner: [] | [Principal];
        subaccount: [] | [Uint8Array | number[]];
      },
    ],
    { Ok: Array<UtxoStatus> } | { Err: UpdateBalanceError }
  >;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
