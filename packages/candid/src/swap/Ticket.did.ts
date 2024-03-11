export const idlFactory = ({ IDL }: any) => {
  const Value = IDL.Rec();
  const Ticket = IDL.Record({
    subject: IDL.Text,
    user: IDL.Principal,
    message: IDL.Text,
    canister: IDL.Principal,
    timestamp: IDL.Int,
    category: IDL.Text
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null
  });
  const Result = IDL.Variant({ ok: CycleInfo, err: Error });
  Value.fill(
    IDL.Variant({
      Map: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      List: IDL.Vec(Value),
      Text: IDL.Text
    })
  );
  const Config = IDL.Record({
    id: IDL.Text,
    value: Value,
    appName: IDL.Opt(IDL.Text),
    version: IDL.Nat32,
    group: IDL.Text,
    category: IDL.Opt(IDL.Text),
    namespace: IDL.Text
  });
  const Page = IDL.Record({
    content: IDL.Vec(Ticket),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  return IDL.Service({
    addTicket: IDL.Func([IDL.Principal, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    get: IDL.Func([IDL.Nat], [IDL.Opt(Ticket)], ["query"]),
    getCycleInfo: IDL.Func([], [Result], []),
    onMessage: IDL.Func([IDL.Vec(Config)], [], ["oneway"]),
    register: IDL.Func([], [], []),
    remove: IDL.Func([IDL.Nat], [IDL.Bool], []),
    tickets: IDL.Func([IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)], [Page], ["query"])
  });
};
