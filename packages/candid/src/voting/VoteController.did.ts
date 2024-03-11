export const idlFactory = ({ IDL }: any) => {
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: IDL.Text
  });
  const ProjectInfo = IDL.Record({
    tokenCid: IDL.Text,
    logo: IDL.Text,
    name: IDL.Text,
    projectCid: IDL.Text,
    managerAddress: User,
    tokenStand: IDL.Text
  });
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(ProjectInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_2 = IDL.Variant({ ok: Page, err: IDL.Text });
  const ResponseResult_1 = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text
  });
  const TextResult = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const ResponseResult = IDL.Variant({ ok: ProjectInfo, err: IDL.Text });
  return IDL.Service({
    add: IDL.Func([ProjectInfo], [BoolResult], []),
    addAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    create: IDL.Func([ProjectInfo], [BoolResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], []),
    delete: IDL.Func([IDL.Text], [BoolResult], []),
    findProjectPage: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_2], ["query"]),
    getAdminList: IDL.Func([], [ResponseResult_1], ["query"]),
    getFileCanister: IDL.Func([], [TextResult], ["query"]),
    getProject: IDL.Func([IDL.Text], [ResponseResult], ["query"]),
    removeAdmin: IDL.Func([IDL.Text], [BoolResult], []),
    setFileCanister: IDL.Func([IDL.Text], [BoolResult], [])
  });
};
