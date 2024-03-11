export const idlFactory = ({ IDL }) => {
  const Pool = IDL.Record({
    'fee' : IDL.Nat,
    'ticks' : IDL.Vec(IDL.Int),
    'liquidity' : IDL.Nat,
    'tickCurrent' : IDL.Int,
    'token0' : IDL.Text,
    'token1' : IDL.Text,
    'sqrtRatioX96' : IDL.Nat,
  });
  const Address = IDL.Text;
  const PrincipalText = IDL.Text;
  const Uint24 = IDL.Nat;
  const Int24 = IDL.Int;
  const TextResult = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const TradeOverview = IDL.Record({
    'tvl' : IDL.Nat,
    'tradeUserNum' : IDL.Nat,
    'volume' : IDL.Nat,
    'tradeSymbolNum' : IDL.Nat,
  });
  const PoolInfo = IDL.Record({
    'fee' : IDL.Nat,
    'ticks' : IDL.Vec(IDL.Int),
    'pool' : IDL.Text,
    'liquidity' : IDL.Nat,
    'tickCurrent' : IDL.Int,
    'token0' : IDL.Text,
    'token1' : IDL.Text,
    'sqrtRatioX96' : IDL.Nat,
    'balance0' : IDL.Nat,
    'balance1' : IDL.Nat,
  });
  const Page = IDL.Record({
    'content' : IDL.Vec(PoolInfo),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  return IDL.Service({
    '_getPool' : IDL.Func([IDL.Text], [Pool], []),
    'addAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'createPool' : IDL.Func(
        [Address, IDL.Text, Address, IDL.Text, IDL.Nat],
        [PrincipalText],
        [],
      ),
    'cycleAvailable' : IDL.Func([], [IDL.Nat], []),
    'cycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'enableFeeAmount' : IDL.Func([Uint24, Int24], [TextResult], []),
    'getAdminList' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getInvalidPool' : IDL.Func([IDL.Text], [PrincipalText], ['query']),
    'getOverview' : IDL.Func([], [TradeOverview], []),
    'getPool' : IDL.Func([IDL.Text], [PrincipalText], ['query']),
    'getPoolIds' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getPoolList' : IDL.Func([], [IDL.Vec(PoolInfo)], []),
    'getPoolListByPage' : IDL.Func([IDL.Nat, IDL.Nat], [Page], []),
    'getPools' : IDL.Func([IDL.Vec(IDL.Text)], [IDL.Vec(Pool)], []),
    'removeAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'removePool' : IDL.Func([Address], [], ['oneway']),
    'setBaseDataStructureCanister' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
