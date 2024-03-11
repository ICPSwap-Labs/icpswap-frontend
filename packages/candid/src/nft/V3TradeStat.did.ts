export const idlFactory = ({ IDL }) => {
  const BoolResult = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const NatResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const TradeStatResp = IDL.Record({
    'cid' : IDL.Text,
    'totalVolume' : IDL.Nat,
    'listSize' : IDL.Nat,
    'name' : IDL.Text,
    'totalTurnover' : IDL.Nat,
    'floorPrice' : IDL.Nat,
    'avgPrice' : IDL.Nat,
    'maxPrice' : IDL.Nat,
    'minPrice' : IDL.Nat,
    'transactionCount' : IDL.Nat,
  });
  const Page = IDL.Record({
    'content' : IDL.Vec(TradeStatResp),
    'offset' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalElements' : IDL.Nat,
  });
  const ResponseResult_3 = IDL.Variant({ 'ok' : Page, 'err' : IDL.Text });
  const ResponseResult_2 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Text),
    'err' : IDL.Text,
  });
  const ResponseResult_1 = IDL.Variant({
    'ok' : TradeStatResp,
    'err' : IDL.Text,
  });
  const StatResponse = IDL.Record({
    'totalVolume' : IDL.Nat,
    'listSize' : IDL.Nat,
    'totalTurnover' : IDL.Nat,
    'avgPrice' : IDL.Nat,
    'maxPrice' : IDL.Nat,
    'minPrice' : IDL.Nat,
  });
  const ResponseResult = IDL.Variant({ 'ok' : StatResponse, 'err' : IDL.Text });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [BoolResult], []),
    'cycleAvailable' : IDL.Func([], [NatResult], []),
    'cycleBalance' : IDL.Func([], [NatResult], []),
    'findCanisterStat' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [ResponseResult_3],
        ['query'],
      ),
    'findNameStat' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [ResponseResult_3],
        ['query'],
      ),
    'getAdminList' : IDL.Func([], [ResponseResult_2], ['query']),
    'getCanisterStat' : IDL.Func([IDL.Text], [ResponseResult_1], ['query']),
    'getNameStat' : IDL.Func([IDL.Text], [ResponseResult_1], ['query']),
    'getStat' : IDL.Func([], [ResponseResult], ['query']),
    'init' : IDL.Func([], [NatResult], []),
    'listStat' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Bool],
        [BoolResult],
        [],
      ),
    'removeAdmin' : IDL.Func([IDL.Text], [BoolResult], []),
    'setCanisterId' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [BoolResult],
        [],
      ),
    'tradeStat' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Text, IDL.Text],
        [BoolResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
