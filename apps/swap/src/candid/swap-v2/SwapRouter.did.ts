export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Address = IDL.Text;
  const ResponseResult = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text,
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    exactInput: IDL.Func([Address, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text], [NatResult], []),
    exactInputSingle: IDL.Func([Address, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [NatResult], []),
    exactOutput: IDL.Func([Address, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text], [NatResult], []),
    exactOutputSingle: IDL.Func([Address, IDL.Principal, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [NatResult], []),
    getAdminList: IDL.Func([], [ResponseResult], ["query"]),
    getUnitPrice: IDL.Func([IDL.Text, IDL.Text], [NatResult], []),
    quoteExactInput: IDL.Func([IDL.Text, IDL.Text], [NatResult], []),
    quoteExactInputSingle: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [NatResult], []),
    quoteExactOutput: IDL.Func([IDL.Text, IDL.Text], [NatResult], []),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    setBaseDataStructureCanister: IDL.Func([IDL.Text], [], []),
  });
};
