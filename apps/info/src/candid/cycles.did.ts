export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const ResponseResult_7 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: IDL.Text,
  });
  const CanisterInfo = IDL.Record({
    topupTotal: IDL.Nat,
    canisterName: IDL.Opt(IDL.Text),
    canisterType: IDL.Opt(IDL.Text),
    cycleBalance: IDL.Nat,
    canisterReturnMode: IDL.Opt(IDL.Text),
    canisterId: IDL.Principal,
  });
  const Page = IDL.Record({
    content: IDL.Vec(CanisterInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const ResponseResult_3 = IDL.Variant({ ok: Page, err: IDL.Text });
  const Page_3 = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const ResponseResult_6 = IDL.Variant({ ok: Page_3, err: IDL.Text });
  const CycleScanRecord = IDL.Record({
    scanTime: IDL.Int,
    canisterName: IDL.Text,
    canisterType: IDL.Text,
    cycleBalance: IDL.Nat,
    canisterId: IDL.Principal,
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(CycleScanRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const ResponseResult_5 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const CycleTopupRecord = IDL.Record({
    topupTime: IDL.Int,
    canisterName: IDL.Text,
    canisterType: IDL.Text,
    topupCycleAmount: IDL.Nat,
    canisterId: IDL.Principal,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(CycleTopupRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const ResponseResult_4 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const ResponseResult_2 = IDL.Variant({
    ok: CanisterInfo,
    err: IDL.Text,
  });
  const ResponseResult_1 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text,
  });
  const CanisterStatInfo = IDL.Record({
    topupTotal: IDL.Nat,
    canisterSize: IDL.Nat,
    cycleBalance: IDL.Nat,
    canisterId: IDL.Principal,
  });
  const ResponseResult = IDL.Variant({
    ok: CanisterStatInfo,
    err: IDL.Text,
  });
  return IDL.Service({
    add: IDL.Func([IDL.Principal, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [BoolResult], []),
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    addBalckList: IDL.Func([IDL.Principal], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    cycleScan: IDL.Func([], [BoolResult], []),
    cycleTopup: IDL.Func([], [BoolResult], []),
    delete: IDL.Func([IDL.Principal], [BoolResult], []),
    deletePending: IDL.Func([IDL.Principal], [BoolResult], []),
    findBalckList: IDL.Func([], [ResponseResult_7], ["query"]),
    findPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    findPendingPage: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_6], ["query"]),
    findScanRecordPage: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat],
      [ResponseResult_5],
      ["query"]
    ),
    findTopupRecordPage: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat],
      [ResponseResult_4],
      ["query"]
    ),
    findZeroPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    get: IDL.Func([IDL.Principal], [ResponseResult_2], ["query"]),
    getAdminList: IDL.Func([], [ResponseResult_1], ["query"]),
    getStat: IDL.Func([], [ResponseResult], ["query"]),
    getTaskState: IDL.Func([], [BoolResult], ["query"]),
    importCanister: IDL.Func([], [BoolResult], []),
    registerTask: IDL.Func([], [BoolResult], []),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    removeBalckList: IDL.Func([IDL.Principal], [BoolResult], []),
    setTaskState: IDL.Func([IDL.Bool], [BoolResult], []),
    task: IDL.Func([IDL.Text], [], []),
  });
};
