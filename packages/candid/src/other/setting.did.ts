export const idlFactory = ({ IDL }: any) => {
  const AdsPage = IDL.Record({
    url: IDL.Text,
    content: IDL.Text,
    button_name: IDL.Text,
  });
  const Result = IDL.Variant({
    ok: IDL.Record({ balance: IDL.Nat, available: IDL.Nat }),
    err: IDL.Text,
  });
  const ChartType = IDL.Variant({
    TVl: IDL.Null,
    DexTools: IDL.Null,
    Volume: IDL.Null,
    Dexscreener: IDL.Null,
    Token0: IDL.Null,
    Token1: IDL.Null,
    Liquidity: IDL.Null,
  });
  const GlobalNotice = IDL.Record({ url: IDL.Text, content: IDL.Text });
  return IDL.Service({
    add_controller: IDL.Func([IDL.Principal], [], []),
    add_default_token: IDL.Func([IDL.Principal], [], []),
    add_maintenance_page: IDL.Func([IDL.Text, IDL.Text], [], []),
    get_active_maintenance_pages: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    get_ads_page: IDL.Func([], [IDL.Opt(AdsPage)], ["query"]),
    get_controllers: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    get_cycle_info: IDL.Func([], [Result], []),
    get_default_chart_type: IDL.Func([], [ChartType], ["query"]),
    get_default_tokens: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    get_global_notice: IDL.Func([], [IDL.Opt(GlobalNotice)], ["query"]),
    get_maintenance_pages: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    remove_controller: IDL.Func([IDL.Principal], [], []),
    remove_default_token: IDL.Func([IDL.Principal], [], []),
    remove_maintenance_page: IDL.Func([IDL.Text], [], []),
    set_ads_page: IDL.Func([AdsPage], [], []),
    set_default_chart_type: IDL.Func([ChartType], [], []),
    set_global_notice: IDL.Func([IDL.Text, IDL.Text], [], []),
    update_maintenance_page_status: IDL.Func([IDL.Text, IDL.Bool], [], []),
  });
};
