export const idlFactory = ({ IDL }: any) => {
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
      AmountTooSmall: IDL.Null,
    }),
  });
  const Metadata = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    owner: IDL.Principal,
    logo: IDL.Text,
    name: IDL.Text,
    totalSupply: IDL.Nat,
    symbol: IDL.Text,
  });
  const TokenInfo = IDL.Record({
    holderNumber: IDL.Nat64,
    deployTime: IDL.Nat64,
    metadata: Metadata,
    historySize: IDL.Nat64,
    cycles: IDL.Nat64,
    feeTo: IDL.Principal,
  });
  return IDL.Service({
    allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ["query"]),
    approve: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
    cleanOutOldAllowances: IDL.Func([], [IDL.Nat], []),
    decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    filterAllowancesArray: IDL.Func(
      [IDL.Int],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Tuple(IDL.Nat, IDL.Int)))))],
      []
    ),
    getASize: IDL.Func([], [IDL.Nat], ["query"]),
    getAgeAllowanceLimit: IDL.Func([], [IDL.Int], []),
    getAllowanceSize: IDL.Func([], [IDL.Nat], ["query"]),
    getAllowancesArray: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Tuple(IDL.Nat, IDL.Int)))))],
      []
    ),
    getMaxAllowances: IDL.Func([], [IDL.Int], []),
    getMetadata: IDL.Func([], [Metadata], ["query"]),
    getResultArrayIndex: IDL.Func([], [IDL.Int], []),
    getSpendersSize: IDL.Func([], [IDL.Nat], []),
    getTokenFee: IDL.Func([], [IDL.Nat], ["query"]),
    getTokenInfo: IDL.Func([], [TokenInfo], ["query"]),
    getUserApprovals: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    historySize: IDL.Func([], [IDL.Nat], []),
    logo: IDL.Func([], [IDL.Text], ["query"]),
    name: IDL.Func([], [IDL.Text], ["query"]),
    setAgeAllowanceLimit: IDL.Func([], [IDL.Nat], []),
    setFee: IDL.Func([IDL.Nat], [], ["oneway"]),
    setLogo: IDL.Func([IDL.Text], [], ["oneway"]),
    setMaxAllowances: IDL.Func([IDL.Int], [], []),
    setName: IDL.Func([IDL.Text], [], ["oneway"]),
    setOwner: IDL.Func([IDL.Principal], [], ["oneway"]),
    symbol: IDL.Func([], [IDL.Text], ["query"]),
    totalSupply: IDL.Func([], [IDL.Nat], []),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat], [TxReceipt], []),
  });
};
