export const idlFactory = ({ IDL }: any) => {
  const DepositArgs = IDL.Record({ fee: IDL.Nat, amount: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: Error });
  const WithdrawArgs = IDL.Record({ fee: IDL.Nat, amount: IDL.Nat });
  return IDL.Service({
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
    deposit: IDL.Func([DepositArgs], [Result], []),
    depositFrom: IDL.Func([DepositArgs], [Result], []),
    destoryPasscode: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [Result_1],
      []
    ),
    getFactoryCid: IDL.Func([], [IDL.Principal], ["query"]),
    getTokenCid: IDL.Func([], [IDL.Principal], ["query"]),
    metadata: IDL.Func(
      [],
      [
        IDL.Record({
          passcodePrice: IDL.Nat,
          tokenCid: IDL.Principal,
          factoryCid: IDL.Principal,
        }),
      ],
      []
    ),
    requestPasscode: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [Result_1],
      []
    ),
    withdraw: IDL.Func([WithdrawArgs], [Result], []),
  });
};
