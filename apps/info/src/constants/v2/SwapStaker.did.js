export const idlFactory = ({ IDL }) => {
  const PublicIncentive = IDL.Record({
    storageCanisterId: IDL.Text,
    startTime: IDL.Nat,
    status: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    numberOfStakes: IDL.Nat,
    incentiveCanisterId: IDL.Text,
    rewardToken: IDL.Text,
    totalLiquidity: IDL.Nat,
    endTime: IDL.Nat,
    incentive: IDL.Text,
    totalAmount0: IDL.Int,
    totalAmount1: IDL.Int,
    pool: IDL.Text,
    refundee: IDL.Text,
    rewardStandard: IDL.Text,
    totalRewardClaimed: IDL.Nat,
    stakesTokenIds: IDL.Vec(IDL.Nat),
    rewardTokenFee: IDL.Nat,
    poolToken0: IDL.Text,
    poolToken1: IDL.Text,
    poolFee: IDL.Nat,
    totalReward: IDL.Nat,
    userTotalAmount0: IDL.Int,
    userTotalAmount1: IDL.Int,
    rewardTokenDecimals: IDL.Nat,
    userNumberOfStakes: IDL.Nat,
    totalRewardUnclaimed: IDL.Nat,
    totalSecondsClaimedX128: IDL.Nat,
    userTotalLiquidity: IDL.Nat,
  });
  const InitProxyCanister = IDL.Record({
    storageCanisterId: IDL.Text,
    swapNFTCanisterId: IDL.Text,
    wicpCanisterId: IDL.Text,
    swapRouterCanisterId: IDL.Text,
    swapPositionManagerCanisterId: IDL.Text,
    wicpDecimals: IDL.Nat,
  });
  const ResponseResult = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier,
  });
  const TokenIndex = IDL.Nat32;
  const KVPair = IDL.Record({ k: IDL.Text, v: IDL.Text });
  const TokenMetadata__1 = IDL.Record({
    cId: IDL.Text,
    tokenId: TokenIndex,
    owner: AccountIdentifier,
    metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    link: IDL.Text,
    name: IDL.Text,
    minter: AccountIdentifier,
    filePath: IDL.Text,
    fileType: IDL.Text,
    mintTime: IDL.Int,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    artistName: IDL.Text,
  });
  const Page = IDL.Record({
    content: IDL.Vec(TokenMetadata__1),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const ResponseResult_5 = IDL.Variant({ ok: Page, err: IDL.Text });
  const TokenMetadata = IDL.Record({
    cId: IDL.Text,
    tokenId: TokenIndex,
    owner: AccountIdentifier,
    metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    link: IDL.Text,
    name: IDL.Text,
    minter: AccountIdentifier,
    filePath: IDL.Text,
    fileType: IDL.Text,
    mintTime: IDL.Int,
    introduction: IDL.Text,
    attributes: IDL.Vec(KVPair),
    royalties: IDL.Nat,
    nftType: IDL.Text,
    artistName: IDL.Text,
  });
  const Deposit = IDL.Record({
    tokenId: IDL.Nat,
    numberOfStakes: IDL.Nat,
    tickUpper: IDL.Int,
    owner: IDL.Text,
    pool: IDL.Text,
    tokenMetadata: TokenMetadata,
    holder: IDL.Text,
    tickLower: IDL.Int,
  });
  const ResponseResult_4 = IDL.Variant({ ok: Deposit, err: IDL.Text });
  const ResponseResult_3 = IDL.Variant({
    ok: PublicIncentive,
    err: IDL.Text,
  });
  const RewardInfo = IDL.Record({
    reward: IDL.Nat,
    secondsInsideX128: IDL.Nat,
  });
  const ResponseResult_2 = IDL.Variant({ ok: RewardInfo, err: IDL.Text });
  const Stake = IDL.Record({
    liquidityNoOverflow: IDL.Nat,
    secondsPerLiquidityInsideInitialX128: IDL.Nat,
    liquidityIfOverflow: IDL.Nat,
  });
  const ResponseResult_1 = IDL.Variant({ ok: Stake, err: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const SwapStaker = IDL.Service({
    addAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    cycleAvailable: IDL.Func([], [IDL.Nat], []),
    cycleBalance: IDL.Func([], [IDL.Nat], []),
    endIncentive: IDL.Func([], [ResponseResult], []),
    findUserIncentivesTokenids: IDL.Func([User, IDL.Nat, IDL.Nat], [ResponseResult_5], []),
    getAdminList: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    getDeposits: IDL.Func([IDL.Nat], [ResponseResult_4], []),
    getIncentives: IDL.Func([User], [ResponseResult_3], []),
    getRewardInfo: IDL.Func([IDL.Vec(IDL.Nat)], [ResponseResult_2], []),
    getStakes: IDL.Func([IDL.Nat], [ResponseResult_1], []),
    getSwapNFTCanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getSwapPositionManagerCanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getSwapRouterCanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getSwapStakerStorageCanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getWicpCanisterId: IDL.Func([], [IDL.Text], ["query"]),
    getWicpDecimals: IDL.Func([], [IDL.Nat], ["query"]),
    initIncentives: IDL.Func([PublicIncentive], [], []),
    isAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    openReward: IDL.Func([IDL.Nat], [], []),
    removeAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    setHeartFeeRate: IDL.Func([IDL.Nat], [], []),
    setSwapNFTCanisterId: IDL.Func([IDL.Text], [], []),
    setSwapRouterCanisterId: IDL.Func([IDL.Text], [], []),
    setSwapStakerStorageCanisterId: IDL.Func([IDL.Text], [], []),
    setWicpCanisterId: IDL.Func([IDL.Text], [], []),
    setWicpDecimals: IDL.Func([IDL.Nat], [], []),
    setswapPositionManagerCanisterId: IDL.Func([IDL.Text], [], []),
    stakeTokenids: IDL.Func([IDL.Nat], [ResponseResult], []),
    transferToken: IDL.Func([IDL.Nat], [Result], []),
    unstakeTokenids: IDL.Func([IDL.Nat], [ResponseResult], []),
  });
  return SwapStaker;
};
export const init = ({ IDL }) => {
  const PublicIncentive = IDL.Record({
    storageCanisterId: IDL.Text,
    startTime: IDL.Nat,
    status: IDL.Text,
    rewardTokenSymbol: IDL.Text,
    numberOfStakes: IDL.Nat,
    incentiveCanisterId: IDL.Text,
    rewardToken: IDL.Text,
    totalLiquidity: IDL.Nat,
    endTime: IDL.Nat,
    incentive: IDL.Text,
    totalAmount0: IDL.Int,
    totalAmount1: IDL.Int,
    pool: IDL.Text,
    refundee: IDL.Text,
    rewardStandard: IDL.Text,
    totalRewardClaimed: IDL.Nat,
    stakesTokenIds: IDL.Vec(IDL.Nat),
    rewardTokenFee: IDL.Nat,
    poolToken0: IDL.Text,
    poolToken1: IDL.Text,
    poolFee: IDL.Nat,
    totalReward: IDL.Nat,
    userTotalAmount0: IDL.Int,
    userTotalAmount1: IDL.Int,
    rewardTokenDecimals: IDL.Nat,
    userNumberOfStakes: IDL.Nat,
    totalRewardUnclaimed: IDL.Nat,
    totalSecondsClaimedX128: IDL.Nat,
    userTotalLiquidity: IDL.Nat,
  });
  const InitProxyCanister = IDL.Record({
    storageCanisterId: IDL.Text,
    swapNFTCanisterId: IDL.Text,
    wicpCanisterId: IDL.Text,
    swapRouterCanisterId: IDL.Text,
    swapPositionManagerCanisterId: IDL.Text,
    wicpDecimals: IDL.Nat,
  });
  return [PublicIncentive, InitProxyCanister];
};
