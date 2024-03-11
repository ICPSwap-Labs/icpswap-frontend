export default ({ IDL }) => {
  return IDL.Service({
    totalSupply: IDL.Func([], [IDL.Nat], [])
  });
};
