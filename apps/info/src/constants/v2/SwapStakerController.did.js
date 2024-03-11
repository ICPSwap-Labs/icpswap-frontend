export const idlFactory = ({ IDL }) => {
  const IncentiveKey = IDL.Record({
    'startTime' : IDL.Nat,
    'rewardTokenSymbol' : IDL.Text,
    'rewardToken' : IDL.Text,
    'endTime' : IDL.Nat,
    'pool' : IDL.Text,
    'rewardStandard' : IDL.Text,
    'rewardTokenFee' : IDL.Nat,
    'rewardTokenDecimals' : IDL.Nat,
  });
  const ResponseResult_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const InitRequest = IDL.Record({
    'stakingTokenSymbol' : IDL.Text,
    'startTime' : IDL.Nat,
    'rewardTokenSymbol' : IDL.Text,
    'stakingToken' : IDL.Text,
    'rewardToken' : IDL.Text,
    'stakingStandard' : IDL.Text,
    'rewardPerTime' : IDL.Nat,
    'name' : IDL.Text,
    'rewardStandard' : IDL.Text,
    'stakingTokenFee' : IDL.Nat,
    'rewardTokenFee' : IDL.Nat,
    'stakingTokenDecimals' : IDL.Nat,
    'bonusEndTime' : IDL.Nat,
    'BONUS_MULTIPLIER' : IDL.Nat,
    'rewardTokenDecimals' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const PublicIncentive = IDL.Record({
    'storageCanisterId' : IDL.Text,
    'startTime' : IDL.Nat,
    'status' : IDL.Text,
    'rewardTokenSymbol' : IDL.Text,
    'numberOfStakes' : IDL.Nat,
    'incentiveCanisterId' : IDL.Text,
    'rewardToken' : IDL.Text,
    'totalLiquidity' : IDL.Nat,
    'endTime' : IDL.Nat,
    'incentive' : IDL.Text,
    'totalAmount0' : IDL.Int,
    'totalAmount1' : IDL.Int,
    'pool' : IDL.Text,
    'refundee' : IDL.Text,
    'rewardStandard' : IDL.Text,
    'totalRewardClaimed' : IDL.Nat,
    'stakesTokenIds' : IDL.Vec(IDL.Nat),
    'rewardTokenFee' : IDL.Nat,
    'poolToken0' : IDL.Text,
    'poolToken1' : IDL.Text,
    'poolFee' : IDL.Nat,
    'totalReward' : IDL.Nat,
    'userTotalAmount0' : IDL.Int,
    'userTotalAmount1' : IDL.Int,
    'rewardTokenDecimals' : IDL.Nat,
    'userNumberOfStakes' : IDL.Nat,
    'totalRewardUnclaimed' : IDL.Nat,
    'totalSecondsClaimedX128' : IDL.Nat,
    'userTotalLiquidity' : IDL.Nat,
  });
  const Page_1 = IDL.Record({
    'content' : IDL.Vec(PublicIncentive),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const ResponseResult_1 = IDL.Variant({ 'ok' : Page_1, 'err' : IDL.Text });
  const GlobalDataResult = IDL.Record({
    'count' : IDL.Nat,
    'globalTVL' : IDL.Float64,
    'globalRewardTVL' : IDL.Float64,
  });
  const ResponseResult = IDL.Variant({
    'ok' : GlobalDataResult,
    'err' : IDL.Text,
  });
  const SingleSmartChefGlobalDataType = IDL.Record({
    'earned' : IDL.Float64,
    'stakerNumber' : IDL.Float64,
  });
  const Result_1 = IDL.Variant({
    'ok' : SingleSmartChefGlobalDataType,
    'err' : IDL.Text,
  });
  const SmartChefType = IDL.Record({
    'stakingTokenSymbol' : IDL.Text,
    'storageCanisterId' : IDL.Text,
    'startTime' : IDL.Nat,
    'rewardTokenSymbol' : IDL.Text,
    'creator' : IDL.Text,
    'stakingToken' : IDL.Text,
    'rewardToken' : IDL.Text,
    'name' : IDL.Text,
    'createTime' : IDL.Nat,
    'stakingTokenFee' : IDL.Nat,
    'rewardTokenFee' : IDL.Nat,
    'stakingTokenDecimals' : IDL.Nat,
    'bonusEndTime' : IDL.Nat,
    'rewardTokenDecimals' : IDL.Nat,
    'canisterId' : IDL.Text,
  });
  const Page = IDL.Record({
    'content' : IDL.Vec(SmartChefType),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : Page, 'err' : Page });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'addControllers' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'createIncentive' : IDL.Func(
        [IncentiveKey, IDL.Nat],
        [ResponseResult_2],
        [],
      ),
    'createSingleSmartChef' : IDL.Func([InitRequest], [Result_2], []),
    'cycleAvailable' : IDL.Func([], [IDL.Nat], ['query']),
    'cycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'deleteSingleSmartList' : IDL.Func([IDL.Text], [], []),
    'destroyStakerCanister' : IDL.Func([IDL.Text], [], []),
    'findIncentivesPoolsList' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [ResponseResult_1],
        ['query'],
      ),
    'getAdminList' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'getCanister' : IDL.Func(
        [],
        [
          IDL.Record({
            'positionManager' : IDL.Text,
            'wicp' : IDL.Text,
            'swapNFTCanisterId' : IDL.Text,
            'router' : IDL.Text,
            'wicpDecimals' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getGlobalData' : IDL.Func([], [ResponseResult], []),
    'getInitCycles' : IDL.Func([], [IDL.Nat], []),
    'getSingleSmartGlobalData' : IDL.Func([], [Result_1], ['query']),
    'isAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'removeAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'setHeartRate' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setInitCycles' : IDL.Func([IDL.Nat], [], []),
    'setSwapNFTCanisterId' : IDL.Func([IDL.Text], [], []),
    'setSwapPositionManagerCanisterId' : IDL.Func([IDL.Text], [], []),
    'setSwapRouterCanisterId' : IDL.Func([IDL.Text], [], []),
    'setWicpCanisterId' : IDL.Func([IDL.Text], [], []),
    'setWicpDecimals' : IDL.Func([IDL.Nat], [], []),
    'singleSmartChefList' : IDL.Func([IDL.Nat, IDL.Nat], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
