export const idlFactory = ({ IDL }: any) => {
  const Value = IDL.Rec();
  const AlertType = IDL.Variant({
    PriceIncrease: IDL.Null,
    MarginOfDecrease24H: IDL.Null,
    MarginOfIncrease24H: IDL.Null,
    PriceDecrease: IDL.Null,
  });
  const AddAlert = IDL.Record({
    alertType: AlertType,
    repeated: IDL.Bool,
    alertValue: IDL.Float64,
    tokenId: IDL.Text,
    email: IDL.Text,
  });
  const Error = IDL.Variant({
    NotController: IDL.Null,
    CommonError: IDL.Null,
    InvalidRequest: IDL.Text,
    InternalError: IDL.Text,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Null, err: Error });
  Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      Nat: IDL.Nat,
      Blob: IDL.Vec(IDL.Nat8),
      Bool: IDL.Bool,
      Text: IDL.Text,
      Float: IDL.Float64,
      Principal: IDL.Principal,
      Array: IDL.Vec(Value),
    }),
  );
  const AlertInfo = IDL.Record({
    id: IDL.Nat,
    alertType: AlertType,
    repeated: IDL.Bool,
    alertValue: IDL.Float64,
    tokenId: IDL.Text,
    metadata: IDL.Vec(Value),
    createdAt: IDL.Nat,
    user: IDL.Principal,
    email: IDL.Text,
  });
  const Page = IDL.Record({
    content: IDL.Vec(AlertInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result = IDL.Variant({ ok: Page, err: Error });
  return IDL.Service({
    add_alert: IDL.Func([AddAlert], [Result_1], []),
    delete_alert: IDL.Func([IDL.Nat], [Result_1], []),
    delete_email: IDL.Func([], [Result_1], []),
    get_alerts: IDL.Func([IDL.Nat, IDL.Nat], [Result], ["query"]),
    get_deleted_alerts: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(IDL.Nat)], ["query"]),
    get_user_alerts: IDL.Func([], [IDL.Vec(AlertInfo)], ["query"]),
  });
};
