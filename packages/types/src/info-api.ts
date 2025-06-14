/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2025-06-13 19:04:22.

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
}

export interface PageResponse<T> extends Serializable {
  totalElements: number;
  content: T[];
  page: number;
  limit: number;
}

export interface PoolApr extends Serializable {
  snapshotTime: number;
  pool: Principal;
  dayId: number;
  apr: number;
}

export interface PoolAprIndex extends Serializable {
  pool: Principal;
  aprAvg1D: number;
  aprAvg7D: number;
  aprAvg30D: number;
}

export interface PoolPrice extends Serializable {
  snapshotTime: number;
  pool: Principal;
  dayId: number;
  hourId: number;
  price: number;
}

export interface PoolTVL {
  poolId: Principal;
  tvl: number;
}

export interface PositionAPR extends Serializable {
  snapshotTime: number;
  poolId: Principal;
  positionId: number;
  dayId: number;
  apr: number;
}

export interface PositionFees extends Serializable {
  snapshotTime: number;
  poolId: Principal;
  positionId: number;
  dayId: number;
  fees: number;
}

export interface PositionIndexResponse extends Serializable {
  pool: Principal;
  positionId: number;
  snapshotTime: number;
  dayId: number;
  token0Amount: number;
  token1Amount: number;
  token0FeeAmount: number;
  token1FeeAmount: number;
  token0FeeDayAmount: number;
  token1FeeDayAmount: number;
  token0USDPrice: number;
  token1USDPrice: number;
  value: number;
  fees: number;
  apr: number;
}

export interface PositionValue extends Serializable {
  snapshotTime: number;
  poolId: Principal;
  positionId: number;
  dayId: number;
  value: number;
}

export interface PriceIndex extends Serializable {
  pool: Principal;
  priceLow24H: number;
  priceHigh24H: number;
  priceLow7D: number;
  priceHigh7D: number;
  priceLow30D: number;
  priceHigh30D: number;
}

export interface TokenResponse extends Serializable {
  ledgerId: string;
  standards: string;
  name: string;
  symbol: string;
  logo: string;
  fee: string;
  decimals: number;
  mintingAccount: string;
  totalSupply: string;
}

export interface UserWalletResponse extends Serializable {
  user: string;
  totalBalance: number;
  tokens: TokenBalance[];
}

export interface Serializable {}

export interface Principal extends Cloneable {
  value?: any;
}

export interface TokenBalance {
  token: string;
  balance: number;
}

export interface Cloneable {}
