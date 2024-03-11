export const idlFactory = ({ IDL }: any) => {
  const Value = IDL.Rec();
  const Map = IDL.Vec(IDL.Tuple(IDL.Text, Value));
  Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: Map,
      Nat: IDL.Nat,
      Nat64: IDL.Nat64,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(Value)
    })
  );
  const Block = Value;
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Transaction = IDL.Record({
    burn: IDL.Opt(
      IDL.Record({
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        amount: IDL.Nat
      })
    ),
    kind: IDL.Text,
    mint: IDL.Opt(
      IDL.Record({
        to: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        amount: IDL.Nat
      })
    ),
    timestamp: IDL.Nat64,
    transfer: IDL.Opt(
      IDL.Record({
        to: Account,
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        amount: IDL.Nat
      })
    )
  });
  return IDL.Service({
    append_blocks: IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
    get_blocks: IDL.Func(
      [IDL.Record({ start: IDL.Nat, length: IDL.Nat })],
      [IDL.Record({ blocks: IDL.Vec(Block) })],
      ["query"]
    ),
    get_transaction: IDL.Func([IDL.Nat64], [IDL.Opt(Transaction)], ["query"]),
    get_transactions: IDL.Func(
      [IDL.Record({ start: IDL.Nat, length: IDL.Nat })],
      [IDL.Record({ transactions: IDL.Vec(Transaction) })],
      ["query"]
    ),
    remaining_capacity: IDL.Func([], [IDL.Nat64], ["query"])
  });
};
