/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2026-04-03 20:09:10.

export interface InfoResult<T> extends Serializable {
  code: number;
  message: string;
  data: T;
}

export interface InfoGlobalDataResponse extends Serializable {
  snapshotTime: number;
  dayId: number;
  level: string;
  volumeUSD: string;
  feesUSD: string;
  txCount: string;
  tvlUSD: string;
}

export interface InfoGlobalRealTimeDataResponse extends Serializable {
  volumeUSD: string;
  volumeUSD24H: string;
  feesUSD: string;
  txCount: string;
  tvlUSD: string;
  totalTradingPairs: number;
  totalUsers: number;
}

export interface InfoPoolDataResponse extends Serializable {
  snapshotTime: number;
  level: string;
  poolId: string;
  poolFee: number;
  token0LedgerId: string;
  token0LiquidityAmount: string;
  token0Price: string;
  token1LedgerId: string;
  token1LiquidityAmount: string;
  token1Price: string;
  tvlUSD: string;
  txCount: string;
  low: string;
  high: string;
  open: string;
  close: string;
  volumeToken0: string;
  volumeToken1: string;
  volumeUSD: string;
  feesUSD: string;
  sqrtPrice: string;
  openTime: number;
  closeTime: number;
  beginTime: number;
  endTime: number;
}

export interface InfoPoolRealTimeDataResponse extends Serializable {
  poolId: string;
  poolFee: number;
  token0LedgerId: string;
  token0Name: string;
  token0Symbol: string;
  token0LiquidityAmount: string;
  token0Price: string;
  token1LedgerId: string;
  token1Name: string;
  token1Symbol: string;
  token1LiquidityAmount: string;
  token1Price: string;
  tvlUSD: string;
  tvlUSDChange24H: string;
  txCount24H: string;
  feesUSD24H: string;
  token0Volume24H: string;
  token1Volume24H: string;
  token0TotalVolume: string;
  token1TotalVolume: string;
  volumeUSD24H: string;
  volumeUSD7D: string;
  totalVolumeUSD: string;
  priceLow24H: string;
  priceHigh24H: string;
  priceLow7D: string;
  priceHigh7D: string;
  priceLow30D: string;
  priceHigh30D: string;
  createTime: number;
}

export interface InfoPoolResponse extends Serializable {
  poolId: string;
  poolFee: string;
  token0Id: string;
  token1Id: string;
  token0Name: string;
  token1Name: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Fee: string;
  token1Fee: string;
}

export interface InfoPositionDataResponse extends Serializable {
  poolId: string;
  positionId: string;
  snapshotTime: number;
  dayId: number;
  token0Amount: string;
  token1Amount: string;
  token0USDPrice: string;
  token1USDPrice: string;
  value: string;
  accountId: string;
}

export interface InfoPositionTopData extends Serializable {
  poolTvlUSD: string;
  totalPositionSize: number;
  positionList: InfoPositionDataResponse[];
}

export interface InfoSwapRecordResponse extends Serializable {
  recordKind: string;
  action: string;
  from: string;
  to: string;
  recipient: string;
  sender: string;
  timestamp: number;
  txId: number;
  poolId: string;
  poolFee: number;
  positionId: number;
  sqrtPrice: string;
  tick: string;
  tickLimit: string;
  liquidityChange: string;
  liquidityTotal: string;
  token0Id: string;
  token0Standard: string;
  token0Symbol: string;
  token0Decimals: number;
  token0ChangeAmount: string;
  token0InAmount: string;
  token0Price: string;
  token0Fee: string;
  token1Id: string;
  token1Standard: string;
  token1Symbol: string;
  token1Decimals: number;
  token1ChangeAmount: string;
  token1InAmount: string;
  token1Price: string;
  token1Fee: string;
  amountToken0: string;
  amountToken1: string;
  amountUsd: string;
}

export interface InfoTokenChartResponse extends Serializable {
  tokenLedgerId: string;
  tokenName: string;
  tokenSymbol: string;
  price: string;
  priceChange24H: string;
  fdv: string;
  marketCap: string;
  tvlUSD: string;
  volumeUSD24H: string;
  holder: string;
  rank: string;
}

export interface InfoTokenDataResponse extends Serializable {
  snapshotTime: number;
  level: string;
  tokenLedgerId: string;
  price: string;
  liquidityAmount: string;
  tvlUSD: string;
  txCount: string;
  low: string;
  high: string;
  open: string;
  close: string;
  amount: string;
  volumeUSD: string;
  openTime: number;
  closeTime: number;
  beginTime: number;
  endTime: number;
}

export interface InfoTokenRealTimeDataResponse extends Serializable {
  tokenLedgerId: string;
  tokenName: string;
  tokenSymbol: string;
  price: string;
  priceChange24H: string;
  tvlUSD: string;
  tvlUSDChange24H: string;
  txCount24H: string;
  volumeUSD24H: string;
  volumeUSD7D: string;
  totalVolumeUSD: string;
  priceLow24H: string;
  priceHigh24H: string;
  priceLow7D: string;
  priceHigh7D: string;
  priceLow30D: string;
  priceHigh30D: string;
}

export interface InfoTransactionResponse extends Serializable {
  poolId: string;
  poolFee: number;
  positionId: number;
  token0LedgerId: string;
  token0Price: string;
  token0Name: string;
  token0Symbol: string;
  token1LedgerId: string;
  token1Price: string;
  token1Name: string;
  token1Symbol: string;
  actionType: string;
  fromPrincipalId: string;
  fromSubaccount: string;
  fromAccountId: string;
  fromTextualId: string;
  fromAlias: string;
  toPrincipalId: string;
  toSubaccount: string;
  toAccountId: string;
  toTextualId: string;
  toAlias: string;
  token0AmountIn: string;
  token1AmountIn: string;
  token0AmountOut: string;
  token1AmountOut: string;
  token0Fee: string;
  token1Fee: string;
  sqrtPrice: string;
  tickLimit: string;
  tick: string;
  liquidity: string;
  currentLiquidity: string;
  txHash: string;
  txTime: number;
  token0TxValue: string;
  token1TxValue: string;
}

export interface PageResponse<T> extends Serializable {
  totalElements: number;
  content: T[];
  page: number;
  limit: number;
}

export interface PoolApr extends Serializable {
  snapshotTime: number;
  pool: string;
  dayId: number;
  apr: string;
}

export interface PoolAprIndex extends Serializable {
  pool: string;
  aprAvg1D: string;
  aprAvg7D: string;
  aprAvg30D: string;
}

export interface PoolPrice extends Serializable {
  snapshotTime: number;
  pool: string;
  dayId: number;
  hourId: number;
  price: string;
}

export interface PoolTVL {
  poolId: string;
  tvl: string;
}

export interface PositionAPR extends Serializable {
  snapshotTime: number;
  poolId: string;
  positionId: string;
  dayId: number;
  apr: string;
}

export interface PositionFees extends Serializable {
  snapshotTime: number;
  poolId: string;
  positionId: string;
  dayId: number;
  fees: string;
}

export interface PositionIndexResponse extends Serializable {
  pool: string;
  positionId: string;
  snapshotTime: number;
  dayId: number;
  token0Amount: string;
  token1Amount: string;
  token0FeeAmount: string;
  token1FeeAmount: string;
  token0FeeDayAmount: string;
  token1FeeDayAmount: string;
  token0USDPrice: string;
  token1USDPrice: string;
  value: string;
  fees: string;
  apr: string;
}

export interface PositionValue extends Serializable {
  snapshotTime: number;
  poolId: string;
  positionId: string;
  dayId: number;
  value: string;
}

export interface PriceIndex extends Serializable {
  pool: string;
  priceLow24H: string;
  priceHigh24H: string;
  priceLow7D: string;
  priceHigh7D: string;
  priceLow30D: string;
  priceHigh30D: string;
}

export interface PriceRecommend extends Serializable {
  minPrice: string;
  maxPrice: string;
}

export interface TokenResponse extends Serializable {
  ledgerId: string;
  name: string;
  symbol: string;
  logo: string;
  fee: string;
  decimals: number;
  mintingAccount: string;
  totalSupply: string;
  liquidity: string;
  price: string;
  priceChange24: string;
  priceICP: string;
  marketCap: string;
  fullyDilutedMarketCap: string;
  tokenDetail: { [index: string]: string };
  standardArray: string[];
  controllerArray: string[];
  holders: number;
  totalAmount: string;
  lockedAmount: string;
  marketAmount: string;
  transactionAmount: string;
  createTime: number;
}

export interface UserAssetResponse extends Serializable {
  tokenList: UserWalletResponse;
  tokenValue: string;
  limitOrderValue: string;
  positionValue: string;
  stakeValue: string;
  farmValue: string;
}

export interface UserWalletResponse extends Serializable {
  user: string;
  totalBalance: number;
  tokens: TokenBalance[];
}

export interface ValueCheckResponse {
  principal: string;
  poolId: string;
  tokenId: string;
  deposit: string;
  withdraw: string;
  buy: string;
  sell: string;
  claim: string;
  addLiq: string;
  removeLiq: string;
  subaccountBalance: string;
  userPoolBalance: string;
}

// oxlint-disable-next-line @typescript-eslint/no-empty-object-type -- serializable marker type
export type Serializable = {};

export interface TokenBalance {
  token: string;
  amount: number;
  balance: number;
}
