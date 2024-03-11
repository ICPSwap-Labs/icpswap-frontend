export default ({ IDL }: any) => {
  const TxReceipt = IDL.Variant({
    Ok: IDL.Nat,
    Err: IDL.Variant({
      InsufficientAllowance: IDL.Null,
      InsufficientBalance: IDL.Null,
      ErrorOperationStyle: IDL.Null,
      Unauthorized: IDL.Null,
      LedgerTrap: IDL.Null,
      ErrorTo: IDL.Null,
      Other: IDL.Text,
      BlockUsed: IDL.Null,
      AmountTooSmall: IDL.Null
    })
  });
  const Metadata = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    owner: IDL.Principal,
    logo: IDL.Text,
    name: IDL.Text,
    totalSupply: IDL.Nat,
    symbol: IDL.Text
  });
  const Time = IDL.Int;
  const TokenInfo = IDL.Record({
    holderNumber: IDL.Nat,
    deployTime: Time,
    metadata: Metadata,
    historySize: IDL.Nat,
    cycles: IDL.Nat,
    feeTo: IDL.Principal
  });
  return IDL.Service({
    allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ["query"]),
    approve: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    burn: IDL.Func([IDL.Nat], [TxReceipt], []),
    decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    getAllowanceSize: IDL.Func([], [IDL.Nat], ["query"]),
    getHolders: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    getMetadata: IDL.Func([], [Metadata], ["query"]),
    getTokenFee: IDL.Func([], [IDL.Nat], ["query"]),
    getTokenInfo: IDL.Func([], [TokenInfo], ["query"]),
    getUserApprovals: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    historySize: IDL.Func([], [IDL.Nat], ["query"]),
    logo: IDL.Func([], [IDL.Text], ["query"]),
    mint: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    name: IDL.Func([], [IDL.Text], ["query"]),
    setFee: IDL.Func([IDL.Nat], [], ["oneway"]),
    setFeeTo: IDL.Func([IDL.Principal], [], ["oneway"]),
    setLogo: IDL.Func([IDL.Text], [], ["oneway"]),
    setName: IDL.Func([IDL.Text], [], ["oneway"]),
    setOwner: IDL.Func([IDL.Principal], [], ["oneway"]),
    symbol: IDL.Func([], [IDL.Text], ["query"]),
    totalSupply: IDL.Func([], [IDL.Nat], ["query"]),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat], [TxReceipt], [])
  });
};
