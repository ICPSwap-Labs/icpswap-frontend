export const idlFactory = ({ IDL }: any) => {
  const NetworkType = IDL.Variant({ IC: IDL.Null });
  const AddressBook = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    network: NetworkType,
    address: IDL.Text,
  });
  const Result = IDL.Variant({
    ok: IDL.Record({ balance: IDL.Nat, available: IDL.Nat }),
    err: IDL.Text,
  });
  return IDL.Service({
    copy: IDL.Func([IDL.Nat], [IDL.Opt(AddressBook)], []),
    create: IDL.Func([NetworkType, IDL.Text, IDL.Text], [], []),
    get: IDL.Func([], [IDL.Vec(AddressBook)], ["query"]),
    get_cycle_info: IDL.Func([], [Result], []),
    remove: IDL.Func([IDL.Nat], [], []),
    update: IDL.Func([IDL.Nat, NetworkType, IDL.Text, IDL.Text], [], []),
  });
};
