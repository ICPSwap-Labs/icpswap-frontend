export const idlFactory = ({ IDL }) => {
  const TransType = IDL.Variant({
    'withdraw' : IDL.Null,
    'unstaking' : IDL.Null,
    'staking' : IDL.Null,
    'endIncentive' : IDL.Null,
    'claim' : IDL.Null,
    'unstakeTokenids' : IDL.Null,
    'deposit' : IDL.Null,
    'stakeTokenids' : IDL.Null,
    'createIncentive' : IDL.Null,
  });
  const Record = IDL.Record({
    'to' : IDL.Text,
    'stakingTokenSymbol' : IDL.Text,
    'rewardTokenSymbol' : IDL.Text,
    'tokenId' : IDL.Opt(IDL.Nat),
    'incentiveCanisterId' : IDL.Text,
    'stakingToken' : IDL.Text,
    'rewardToken' : IDL.Text,
    'stakingStandard' : IDL.Text,
    'transType' : TransType,
    'from' : IDL.Text,
    'pool' : IDL.Opt(IDL.Text),
    'recipient' : IDL.Text,
    'rewardStandard' : IDL.Text,
    'timestamp' : IDL.Nat,
    'stakingTokenDecimals' : IDL.Nat,
    'amount' : IDL.Nat,
    'rewardTokenDecimals' : IDL.Nat,
  });
  const Page = IDL.Record({
    'content' : IDL.Vec(Record),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const ResponseResult = IDL.Variant({ 'ok' : Page, 'err' : IDL.Text });
  const SwapStakerStorage = IDL.Service({
    'cycleAvailable' : IDL.Func([], [IDL.Nat], []),
    'cycleBalance' : IDL.Func([], [IDL.Nat], []),
    'getRewardTrans' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [ResponseResult],
        ['query'],
      ),
    'getTrans' : IDL.Func([IDL.Nat, IDL.Nat], [ResponseResult], ['query']),
    'save' : IDL.Func([Record], [], []),
    'setSwapStakerCanister' : IDL.Func([IDL.Text], [], []),
  });
  return SwapStakerStorage;
};
export const init = ({ IDL }) => { return []; };
