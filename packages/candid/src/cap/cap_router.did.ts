export default ({ IDL }: any) => {
  const Status = IDL.Variant({
    stopped: IDL.Null,
    stopping: IDL.Null,
    running: IDL.Null
  });
  const DefiniteCanisterSettings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat
  });
  const CanisterStatusResponse = IDL.Record({
    status: Status,
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: DefiniteCanisterSettings,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Result = IDL.Variant({
    Ok: CanisterStatusResponse,
    Err: IDL.Text
  });
  const WithWitnessArg = IDL.Record({ witness: IDL.Bool });
  const Witness = IDL.Record({
    certificate: IDL.Vec(IDL.Nat8),
    tree: IDL.Vec(IDL.Nat8)
  });
  const GetIndexCanistersResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canisters: IDL.Vec(IDL.Principal)
  });
  const GetTokenContractRootBucketArg = IDL.Record({
    witness: IDL.Bool,
    canister: IDL.Principal
  });
  const GetTokenContractRootBucketResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canister: IDL.Opt(IDL.Principal)
  });
  const GetUserRootBucketsArg = IDL.Record({
    user: IDL.Principal,
    witness: IDL.Bool
  });
  const GetUserRootBucketsResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    contracts: IDL.Vec(IDL.Principal)
  });
  return IDL.Service({
    bucket_status: IDL.Func([IDL.Principal], [Result], []),
    custom_upgrade_root_bucket: IDL.Func([IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Text], []),
    deploy_plug_bucket: IDL.Func([IDL.Principal, IDL.Nat64], [], []),
    get_index_canisters: IDL.Func([WithWitnessArg], [GetIndexCanistersResponse], ["query"]),
    get_token_contract_root_bucket: IDL.Func(
      [GetTokenContractRootBucketArg],
      [GetTokenContractRootBucketResponse],
      ["query"]
    ),
    get_user_root_buckets: IDL.Func([GetUserRootBucketsArg], [GetUserRootBucketsResponse], ["query"]),
    git_commit_hash: IDL.Func([], [IDL.Text], ["query"]),
    insert_new_users: IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    install_bucket_code: IDL.Func([IDL.Principal], [], []),
    root_buckets_to_upgrade: IDL.Func([], [IDL.Nat64, IDL.Vec(IDL.Principal)], ["query"]),
    trigger_upgrade: IDL.Func([IDL.Text], [], [])
  });
};
