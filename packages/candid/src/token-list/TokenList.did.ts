export const idlFactory = ({ IDL }: any) => {
  const Config = IDL.Record({ value: IDL.Text, name: IDL.Text });
  const Media = IDL.Record({ link: IDL.Text, mediaType: IDL.Text });
  const TokenMetadata = IDL.Record({
    fee: IDL.Nat,
    configs: IDL.Vec(Config),
    decimals: IDL.Nat,
    name: IDL.Text,
    rank: IDL.Nat32,
    mediaLinks: IDL.Vec(Media),
    totalSupply: IDL.Nat,
    introduction: IDL.Text,
    standard: IDL.Text,
    symbol: IDL.Text,
    canisterId: IDL.Text,
  });
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Result_3 = IDL.Variant({
    ok: IDL.Opt(TokenMetadata),
    err: IDL.Text,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const Result_1 = IDL.Variant({
    ok: IDL.Vec(TokenMetadata),
    err: IDL.Text,
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  return IDL.Service({
    add: IDL.Func([TokenMetadata], [BoolResult], []),
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    edit: IDL.Func([IDL.Text, TokenMetadata], [BoolResult], []),
    get: IDL.Func([IDL.Text], [Result_3], ["query"]),
    getAdminList: IDL.Func([], [Result_2], ["query"]),
    getList: IDL.Func([], [Result_1], ["query"]),
    getLogo: IDL.Func([IDL.Text], [Result], ["query"]),
    remove: IDL.Func([IDL.Text], [BoolResult], []),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    updateLogo: IDL.Func([IDL.Text, IDL.Text], [BoolResult], []),
  });
};
