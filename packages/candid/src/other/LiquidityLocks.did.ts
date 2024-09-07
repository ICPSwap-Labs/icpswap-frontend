export const idlFactory = ({ IDL }: any) => {
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const AliasResult = IDL.Record({
    is_public: IDL.Bool,
    alias: IDL.Opt(IDL.Text),
    governance_id: IDL.Opt(IDL.Principal),
    ledger_id: IDL.Principal,
  });
  const Page = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: Page, err: IDL.Text });
  return IDL.Service({
    addPrincipalAlias: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    addSharedPrincipal: IDL.Func([IDL.Principal], [Result], []),
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_2], ["query"]),
    getAllPrincipalAliases: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))], ["query"]),
    getPrincipalAlias: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Text)], ["query"]),
    getPrincipalAliasByLedger: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))], ["query"]),
    getPrincipalAliasByLedgers: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(AliasResult)], ["query"]),
    queryPrincipalAliasPage: IDL.Func([IDL.Nat, IDL.Nat], [Result_1], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    syncSNSProject: IDL.Func([], [Result], []),
  });
};
