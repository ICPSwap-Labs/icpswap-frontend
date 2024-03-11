export default ({ IDL }: any) => {
  return IDL.Service({
    totalSupply: IDL.Func([], [IDL.Nat], []),
  });
};
