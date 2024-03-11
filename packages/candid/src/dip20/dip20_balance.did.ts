export default ({ IDL }) => {
  return IDL.Service({
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
  });
};
