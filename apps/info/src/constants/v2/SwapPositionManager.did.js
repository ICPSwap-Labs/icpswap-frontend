export const idlFactory = ({ IDL }) => {
  const BoolResult__1 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Address = IDL.Text;
  const ResultAmount = IDL.Record({ 'amount0' : IDL.Nat, 'amount1' : IDL.Nat });
  const ResponseResult_1 = IDL.Variant({
    'ok' : ResultAmount,
    'err' : IDL.Text,
  });
  const CollectParams = IDL.Record({
    'tokenId' : IDL.Nat,
    'internalCall' : IDL.Bool,
    'recipient' : IDL.Principal,
    'amount0Max' : IDL.Text,
    'amount1Max' : IDL.Text,
  });
  const ResponseResult_9 = IDL.Variant({ 'ok' : Address, 'err' : IDL.Text });
  const NatResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const DecreaseLiquidityParams = IDL.Record({
    'tokenId' : IDL.Nat,
    'liquidity' : IDL.Text,
    'recipient' : IDL.Principal,
    'amount0Min' : IDL.Text,
    'amount1Min' : IDL.Text,
    'deadline' : IDL.Nat,
  });
  const ResponseResult_10 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Text),
    'err' : IDL.Text,
  });
  const TransactionType = IDL.Variant({
    'fee' : IDL.Null,
    'burn' : IDL.Null,
    'claim' : IDL.Null,
    'mint' : IDL.Null,
    'swap' : IDL.Null,
    'addLiquidity' : IDL.Null,
    'removeLiquidity' : IDL.Null,
    'refreshIncome' : IDL.Null,
    'transfer' : IDL.Null,
    'collect' : IDL.Null,
  });
  const Address__1 = IDL.Text;
  const SwapRecordInfo = IDL.Record({
    'to' : IDL.Text,
    'feeAmount' : IDL.Int,
    'action' : TransactionType,
    'feeAmountTotal' : IDL.Int,
    'token0Id' : Address__1,
    'token1Id' : Address__1,
    'token0AmountTotal' : IDL.Nat,
    'liquidityTotal' : IDL.Nat,
    'from' : IDL.Text,
    'tick' : IDL.Int,
    'feeTire' : IDL.Nat,
    'recipient' : IDL.Text,
    'token0ChangeAmount' : IDL.Nat,
    'token1AmountTotal' : IDL.Nat,
    'liquidityChange' : IDL.Nat,
    'token1Standard' : IDL.Text,
    'TVLToken0' : IDL.Int,
    'TVLToken1' : IDL.Int,
    'token0Fee' : IDL.Nat,
    'token1Fee' : IDL.Nat,
    'timestamp' : IDL.Int,
    'token1ChangeAmount' : IDL.Nat,
    'token0Standard' : IDL.Text,
    'price' : IDL.Nat,
    'poolId' : IDL.Text,
  });
  const PoolKey = IDL.Record({
    'fee' : IDL.Nat,
    'token0' : Address__1,
    'token1' : Address__1,
  });
  const TVLResult = IDL.Record({
    'token0TVL' : IDL.Nat,
    'token1TVL' : IDL.Nat,
  });
  const ResponseResult_8 = IDL.Variant({
    'ok' : IDL.Vec(TVLResult),
    'err' : IDL.Text,
  });
  const PositionWithTokenAmount = IDL.Record({
    'tickUpper' : IDL.Int,
    'tokensOwed0' : IDL.Nat,
    'tokensOwed1' : IDL.Nat,
    'operator' : Address,
    'feeGrowthInside1LastX128' : IDL.Nat,
    'liquidity' : IDL.Nat,
    'feeGrowthInside0LastX128' : IDL.Nat,
    'nonce' : IDL.Nat,
    'token0Amount' : IDL.Nat,
    'token1Amount' : IDL.Nat,
    'tickLower' : IDL.Int,
    'poolId' : IDL.Nat,
  });
  const TickLiquidityInfo = IDL.Record({
    'tickIndex' : IDL.Int,
    'price0Decimal' : IDL.Nat,
    'liquidityNet' : IDL.Int,
    'price0' : IDL.Nat,
    'price1' : IDL.Nat,
    'liquidityGross' : IDL.Nat,
    'price1Decimal' : IDL.Nat,
  });
  const ResponseResult_7 = IDL.Variant({
    'ok' : IDL.Vec(TickLiquidityInfo),
    'err' : IDL.Text,
  });
  const VolumeMapType = IDL.Record({ 'tokenA' : IDL.Nat, 'tokenB' : IDL.Nat });
  const ResponseResult_6 = IDL.Variant({
    'ok' : VolumeMapType,
    'err' : IDL.Text,
  });
  const PushError = IDL.Record({ 'time' : IDL.Int, 'message' : IDL.Text });
  const TxStorageCanisterResponse = IDL.Record({
    'errors' : IDL.Vec(PushError),
    'retryCount' : IDL.Nat,
    'canisterId' : IDL.Text,
  });
  const IncreaseLiquidityParams = IDL.Record({
    'tokenId' : IDL.Nat,
    'recipient' : IDL.Principal,
    'amount0Min' : IDL.Text,
    'amount1Min' : IDL.Text,
    'deadline' : IDL.Nat,
    'amount0Desired' : IDL.Text,
    'amount1Desired' : IDL.Text,
  });
  const LiquidityType = IDL.Record({
    'liquidity' : IDL.Nat,
    'amount0' : IDL.Nat,
    'amount1' : IDL.Nat,
  });
  const ResponseResult_5 = IDL.Variant({
    'ok' : LiquidityType,
    'err' : IDL.Text,
  });
  const QueryPositionResult = IDL.Record({
    'fee' : IDL.Nat,
    'tickUpper' : IDL.Int,
    'tokensOwed0' : IDL.Nat,
    'tokensOwed1' : IDL.Nat,
    'operator' : Address__1,
    'feeGrowthInside1LastX128' : IDL.Nat,
    'liquidity' : IDL.Nat,
    'feeGrowthInside0LastX128' : IDL.Nat,
    'token0' : Address__1,
    'token1' : Address__1,
    'nonce' : IDL.Nat,
    'tickLower' : IDL.Int,
    'poolId' : IDL.Nat,
  });
  const ResponseResult_2 = IDL.Variant({
    'ok' : QueryPositionResult,
    'err' : IDL.Text,
  });
  const MintParams = IDL.Record({
    'fee' : IDL.Nat,
    'tickUpper' : IDL.Int,
    'recipient' : IDL.Principal,
    'amount0Min' : IDL.Text,
    'amount1Min' : IDL.Text,
    'deadline' : IDL.Nat,
    'token0' : Address__1,
    'token1' : Address__1,
    'amount0Desired' : IDL.Text,
    'amount1Desired' : IDL.Text,
    'tickLower' : IDL.Int,
  });
  const MintResult = IDL.Record({
    'tokenId' : IDL.Nat,
    'liquidity' : IDL.Nat,
    'amount0' : IDL.Nat,
    'amount1' : IDL.Nat,
  });
  const ResponseResult_4 = IDL.Variant({ 'ok' : MintResult, 'err' : IDL.Text });
  const ResponseResult_3 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Nat),
    'err' : IDL.Text,
  });
  const BoolResult = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const ResponseResult = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [BoolResult__1], []),
    'addTokenId' : IDL.Func([Address, IDL.Nat], [], []),
    'burn' : IDL.Func([IDL.Nat], [ResponseResult_1], []),
    'clearTxStorageErrors' : IDL.Func([], [IDL.Nat], []),
    'collect' : IDL.Func([CollectParams], [ResponseResult_1], []),
    'collectInInvalidPosition' : IDL.Func(
        [CollectParams],
        [ResponseResult_1],
        [],
      ),
    'createAndInitializePoolIfNecessary' : IDL.Func(
        [Address, IDL.Text, Address, IDL.Text, IDL.Nat, IDL.Text],
        [ResponseResult_9],
        [],
      ),
    'cycleAvailable' : IDL.Func([], [NatResult], []),
    'cycleBalance' : IDL.Func([], [NatResult], ['query']),
    'decreaseLiquidity' : IDL.Func(
        [DecreaseLiquidityParams],
        [ResponseResult_1],
        [],
      ),
    'decreaseLiquidityInInvalidPosition' : IDL.Func(
        [DecreaseLiquidityParams],
        [ResponseResult_1],
        [],
      ),
    'fixOperator' : IDL.Func([IDL.Nat, Address], [], []),
    'getAdminList' : IDL.Func([], [ResponseResult_10], ['query']),
    'getApproved' : IDL.Func([IDL.Nat], [ResponseResult_9], ['query']),
    'getBaseDataStructureCanister' : IDL.Func(
        [IDL.Text],
        [IDL.Text],
        ['query'],
      ),
    'getCachedSwapRecord' : IDL.Func([], [IDL.Vec(SwapRecordInfo)], ['query']),
    'getIntervalTime' : IDL.Func([], [IDL.Int], ['query']),
    'getMaxRetrys' : IDL.Func([], [IDL.Nat], ['query']),
    'getPoolTVL' : IDL.Func([IDL.Vec(PoolKey)], [ResponseResult_8], []),
    'getPositionByPoolAddress' : IDL.Func(
        [Address, IDL.Nat, IDL.Nat],
        [IDL.Vec(PositionWithTokenAmount)],
        [],
      ),
    'getPositionTotalLiquidityByPoolAddress' : IDL.Func(
        [Address],
        [IDL.Nat],
        ['query'],
      ),
    'getTickInfos' : IDL.Func([IDL.Text], [ResponseResult_7], []),
    'getTotalVolume' : IDL.Func([IDL.Text], [ResponseResult_6], []),
    'getTxStorage' : IDL.Func(
        [],
        [IDL.Opt(TxStorageCanisterResponse)],
        ['query'],
      ),
    'increaseLiquidity' : IDL.Func(
        [IncreaseLiquidityParams],
        [ResponseResult_5],
        [],
      ),
    'invalidPositions' : IDL.Func([IDL.Nat], [ResponseResult_2], ['query']),
    'isTxStorageAvailable' : IDL.Func([], [IDL.Bool], ['query']),
    'mint' : IDL.Func([MintParams], [ResponseResult_4], []),
    'ownerInvalidTokens' : IDL.Func([IDL.Text], [ResponseResult_3], ['query']),
    'ownerTokens' : IDL.Func([IDL.Text], [ResponseResult_3], ['query']),
    'positions' : IDL.Func([IDL.Nat], [ResponseResult_2], ['query']),
    'recoverTxStorage' : IDL.Func([], [IDL.Nat], []),
    'refreshIncome' : IDL.Func([IDL.Nat], [ResponseResult_1], []),
    'refreshInvalidIncome' : IDL.Func([IDL.Nat], [ResponseResult_1], []),
    'removeAdmin' : IDL.Func([IDL.Text], [BoolResult__1], []),
    'removeSwapPool' : IDL.Func([Address], [BoolResult], []),
    'removeTokenId' : IDL.Func([Address, IDL.Nat], [], []),
    'removeTxStorage' : IDL.Func([], [], []),
    'setAvailable' : IDL.Func([IDL.Bool], [], ['oneway']),
    'setBaseDataStructureCanister' : IDL.Func([IDL.Text], [], []),
    'setIntervalTime' : IDL.Func([IDL.Int], [], []),
    'setLockServerCanisterId' : IDL.Func([IDL.Text], [], []),
    'setMaxRetrys' : IDL.Func([IDL.Nat], [], []),
    'setSwapNFTCanisterId' : IDL.Func([IDL.Text], [], ['oneway']),
    'setTxStorage' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Nat], []),
    'swapNFTCanisterId' : IDL.Func([], [IDL.Text], ['query']),
    'tokenURI' : IDL.Func([IDL.Nat], [ResponseResult], []),
    'transfer' : IDL.Func([IDL.Nat, IDL.Text], [ResponseResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
