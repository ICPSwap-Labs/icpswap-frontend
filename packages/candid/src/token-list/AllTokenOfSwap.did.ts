export const idlFactory = ({ IDL }: any) => {
  const Result_2 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
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
  const Page = IDL.Record({
    content: IDL.Vec(TokenInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_1 = IDL.Variant({ ok: Page, err: IDL.Text });
  return IDL.Service({
    get_logo: IDL.Func([IDL.Principal], [Result_2], ["query"]),
    get_task_state: IDL.Func([], [Result], ["query"]),
    get_token_list: IDL.Func([IDL.Nat, IDL.Nat, IDL.Opt(IDL.Bool)], [Result_1], ["query"]),
    set_task_state: IDL.Func([IDL.Bool], [Result], []),
    set_token_index: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    set_token_logo: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
  });
};
