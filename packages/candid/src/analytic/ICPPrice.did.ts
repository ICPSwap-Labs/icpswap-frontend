export const idlFactory = ({ IDL }: any) => {
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const WICPType = IDL.Record({
    icpswap: IDL.Record({ decimals: IDL.Nat, address: IDL.Text }),
    sonic: IDL.Record({ decimals: IDL.Nat, address: IDL.Text })
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    cycleAvailable: IDL.Func([], [NatResult], ["query"]),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAdminList: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    getICP_XDR_Price: IDL.Func([], [IDL.Float64], ["query"]),
    getIcpPrice: IDL.Func([IDL.Nat], [IDL.Float64], ["query"]),
    getWicp: IDL.Func([], [WICPType], ["query"]),
    getWicpPrice: IDL.Func([], [IDL.Float64], ["query"]),
    getWicps: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    isAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    removeAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    setICPXDRRate: IDL.Func([IDL.Float64], [], []),
    setWICP: IDL.Func([IDL.Text, IDL.Text], [], []),
    setWicpPrice: IDL.Func([IDL.Float64], [], [])
  });
};
export const init = ({ IDL }: any) => {
  return [];
};
