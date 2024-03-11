export default ({ IDL }: any) => {
  return IDL.Service({
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
  });
};
