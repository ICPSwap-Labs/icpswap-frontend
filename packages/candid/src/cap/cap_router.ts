import type { Principal } from '@dfinity/principal';

export interface CanisterStatusResponse {
  'status' : Status,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : DefiniteCanisterSettings,
  'module_hash' : [] | [Array<number>],
};
export interface DefiniteCanisterSettings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
};
export interface GetIndexCanistersResponse {
  'witness' : [] | [Witness],
  'canisters' : Array<Principal>,
};
export interface GetTokenContractRootBucketArg {
  'witness' : boolean,
  'canister' : Principal,
};
export interface GetTokenContractRootBucketResponse {
  'witness' : [] | [Witness],
  'canister' : [] | [Principal],
};
export interface GetUserRootBucketsArg {
  'user' : Principal,
  'witness' : boolean,
};
export interface GetUserRootBucketsResponse {
  'witness' : [] | [Witness],
  'contracts' : Array<Principal>,
};
export type Result = { 'Ok' : CanisterStatusResponse } |
  { 'Err' : string };
export type Status = { 'stopped' : null } |
  { 'stopping' : null } |
  { 'running' : null };
export interface WithWitnessArg { 'witness' : boolean };
export interface Witness {
  'certificate' : Array<number>,
  'tree' : Array<number>,
};
export default interface _SERVICE {
  'bucket_status' : (arg_0: Principal) => Promise<Result>,
  'custom_upgrade_root_bucket' : (
      arg_0: Principal,
      arg_1: [] | [Array<number>],
    ) => Promise<string>,
  'deploy_plug_bucket' : (arg_0: Principal, arg_1: bigint) => Promise<
      undefined
    >,
  'get_index_canisters' : (arg_0: WithWitnessArg) => Promise<
      GetIndexCanistersResponse
    >,
  'get_token_contract_root_bucket' : (
      arg_0: GetTokenContractRootBucketArg,
    ) => Promise<GetTokenContractRootBucketResponse>,
  'get_user_root_buckets' : (arg_0: GetUserRootBucketsArg) => Promise<
      GetUserRootBucketsResponse
    >,
  'git_commit_hash' : () => Promise<string>,
  'insert_new_users' : (arg_0: Principal, arg_1: Array<Principal>) => Promise<
      undefined
    >,
  'install_bucket_code' : (arg_0: Principal) => Promise<undefined>,
  'root_buckets_to_upgrade' : () => Promise<[bigint, Array<Principal>]>,
  'trigger_upgrade' : (arg_0: string) => Promise<undefined>,
};