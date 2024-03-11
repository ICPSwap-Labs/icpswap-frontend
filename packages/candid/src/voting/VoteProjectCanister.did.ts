export const idlFactory = ({ IDL }: any) => {
  const BoolResult = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const KVPair = IDL.Record({ k: IDL.Text, v: IDL.Nat });
  const ProposalCreateInfo = IDL.Record({
    title: IDL.Text,
    content: IDL.Text,
    endTime: IDL.Int,
    createUser: IDL.Text,
    beginTime: IDL.Int,
    userAmount: IDL.Nat,
    options: IDL.Vec(KVPair)
  });
  const TextResult = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
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
  const ProposalInfo = IDL.Record({
    id: IDL.Text,
    storageCanisterId: IDL.Text,
    title: IDL.Text,
    content: IDL.Text,
    endTime: IDL.Int,
    createTime: IDL.Int,
    createUser: IDL.Text,
    state: IDL.Nat,
    createAddress: User,
    beginTime: IDL.Int,
    userAmount: IDL.Nat,
    options: IDL.Vec(KVPair),
    project: ProjectInfo
  });
  const Page_3 = IDL.Record({
    content: IDL.Vec(ProposalInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_5 = IDL.Variant({ ok: Page_3, err: IDL.Text });
  const UserVoteRecord = IDL.Record({
    voteTime: IDL.Int,
    address: User,
    usedProof: IDL.Nat,
    options: IDL.Vec(KVPair)
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(UserVoteRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_4 = IDL.Variant({ ok: Page_2, err: IDL.Text });
  const UserVotePowersInfo = IDL.Record({
    availablePowers: IDL.Nat,
    address: User,
    usedPowers: IDL.Nat
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(UserVotePowersInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_3 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const Page = IDL.Record({
    content: IDL.Vec(IDL.Principal),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat
  });
  const ResponseResult_2 = IDL.Variant({ ok: Page, err: IDL.Text });
  const ProjectInfo__1 = IDL.Record({
    tokenCid: IDL.Text,
    logo: IDL.Text,
    name: IDL.Text,
    projectCid: IDL.Text,
    managerAddress: User,
    tokenStand: IDL.Text
  });
  const ResponseResult_1 = IDL.Variant({
    ok: ProjectInfo__1,
    err: IDL.Text
  });
  const ResponseResult = IDL.Variant({ ok: ProposalInfo, err: IDL.Text });
  const VoteProjectCanister = IDL.Service({
    addAdmin: IDL.Func([IDL.Principal], [BoolResult], []),
    create: IDL.Func([ProposalCreateInfo], [TextResult], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], []),
    deleteAdmin: IDL.Func([IDL.Principal], [BoolResult], []),
    deleteProposal: IDL.Func([IDL.Text], [BoolResult], []),
    findPage: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat], [ResponseResult_5], ["query"]),
    findRecordPage: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [ResponseResult_4], ["query"]),
    findVotePower: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat, IDL.Nat], [ResponseResult_3], ["query"]),
    getAdminList: IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult_2], ["query"]),
    getProject: IDL.Func([], [ResponseResult_1], ["query"]),
    getProposal: IDL.Func([IDL.Text], [ResponseResult], ["query"]),
    getVotePowerCount: IDL.Func([], [IDL.Nat], ["query"]),
    isProjectAdmin: IDL.Func([IDL.Principal], [IDL.Bool], ["query"]),
    setOwner: IDL.Func([IDL.Principal], [BoolResult], []),
    setProject: IDL.Func([ProjectInfo__1, IDL.Text], [BoolResult], []),
    setState: IDL.Func([IDL.Text, IDL.Nat], [BoolResult], []),
    setVotePower: IDL.Func([IDL.Text, IDL.Vec(UserVotePowersInfo)], [BoolResult], []),
    updateProposal: IDL.Func([ProposalInfo], [BoolResult], []),
    vote: IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [BoolResult], [])
  });
  return VoteProjectCanister;
};
