export const idlFactory = ({ IDL }: any) => {
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const Result_4 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const Result_3 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount),
  });
  const TokenInfo = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat,
    minting_account: IDL.Opt(Account),
    logo: IDL.Opt(IDL.Text),
    name: IDL.Text,
    ledger_id: IDL.Principal,
    min_burn_amount: IDL.Nat,
    max_supply: IDL.Opt(IDL.Nat),
    index: IDL.Nat,
    standard: IDL.Text,
    total_supply: IDL.Nat,
    symbol: IDL.Text,
  });
  const Result_2 = IDL.Variant({ ok: TokenInfo, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(TokenInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: Page, err: IDL.Text });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    status_code: IDL.Nat16,
  });
  return IDL.Service({
    add_token: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    getAdmins: IDL.Func([], [Result_4], ["query"]),
    get_logo: IDL.Func([IDL.Principal], [Result_3], ["query"]),
    get_task_state: IDL.Func([], [Result], ["query"]),
    get_token: IDL.Func([IDL.Principal], [Result_2], ["query"]),
    get_token_list: IDL.Func([IDL.Nat, IDL.Nat, IDL.Opt(IDL.Bool)], [Result_1], ["query"]),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    set_task_state: IDL.Func([IDL.Bool], [Result], []),
    set_token_index: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    set_token_logo: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    set_token_logo_blob: IDL.Func([IDL.Principal, IDL.Vec(IDL.Nat8), IDL.Text], [Result], []),
    set_token_standard: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    sync_token: IDL.Func([], [IDL.Bool], []),
    update_token: IDL.Func([IDL.Principal], [Result], []),
  });
};
