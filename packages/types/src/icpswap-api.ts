export interface IcpSwapAPITokenInfo {
  decimals: number;
  fee: string;
  ledgerId: string;
  mintingAccount: string;
  name: string;
  standards: string;
  symbol: string;
  totalSupply: string;
  logo: string;
  standardArray: string[] | undefined;
}

export type IcpSwapAPIPageResult<T> = {
  totalElements: number;
  content: T[];
  page: number;
  limit: number;
};

export type IcpSwapAPIResult<T> = {
  code: number;
  data: T;
  message: string;
};

export type IcpSwapAPITokenHolderDetail = {
  accountId: string;
  alias?: string;
  amount: string;
  ledgerId: string;
  owner: string;
  snapshotTime: number;
  subaccount: string;
  symbol: string;
  tokenDecimal: number;
  totalSupply: string;
  valueUSD: string;
};

export type IcpSwapAPITokenHolerArgs = {
  isDesc: boolean;
  ledgerId: string;
  page: number;
  size: number;
};

export interface IcpSwapAPITokenDetail {
  controllerArray: string[];
  cycleBalance: number;
  description: string | null;
  details: string | null;
  fee: number;
  fullyDilutedMarketCap: string | null;
  holderAmount: string | null;
  ledgerId: string;
  logo: string | null;
  marketCap: string | null;
  memorySize: number;
  mintingAccount: string;
  moduleHash: string;
  name: string;
  price: number;
  priceChange24: string | null;
  priceICP: number | null;
  source: string;
  standardArray: string[];
  supplyCap: string | null;
  symbol: string;
  tokenDecimal: number;
  totalSupply: number;
  transactionAmount: string | null;
  tvl: string | null;
  txVolume24: string | null;
  tokenDetail: {
    [key: string]: string;
  };
}

export type AddressOverview = {
  farmValue: string;
  limitOrderValue: string;
  positionValue: string;
  stakeValue: string;
  tokenList: {
    tokens: Array<{ token: string; balance: number; amount: number }>;
    totalBalance: number;
    user: string;
  };
  tokenValue: string;
};

export type LatestToken = {
  controllerArray: null | Array<string>;
  createTime: number;
  decimals: number;
  fee: string;
  fullyDilutedMarketCap: null | string;
  holders: number;
  ledgerId: null | string;
  liquidity: string;
  lockedAmount: null | string;
  logo: null | string;
  marketAmount: null | string;
  marketCap: null | string;
  mintingAccount: null | string;
  name: string;
  price: string;
  priceChange24: string;
  priceICP: null;
  standardArray: null;
  symbol: string;
  tokenDetail: null;
  totalAmount: null;
  totalSupply: null;
  transactionAmount: null;
};

export type LatestPool = {
  createTime: number;
  feesUSD24H: string;
  poolFee: null;
  poolId: string;
  priceHigh7D: string;
  priceHigh24H: string;
  priceHigh30D: string;
  priceLow7D: string;
  priceLow24H: string;
  priceLow30D: string;
  token0LedgerId: string;
  token0LiquidityAmount: string;
  token0Name: string;
  token0Price: string;
  token0Symbol: string;
  token0TotalVolume: string;
  token0Volume24H: string;
  token1LedgerId: string;
  token1LiquidityAmount: string;
  token1Name: string;
  token1Price: string;
  token1Symbol: string;
  token1TotalVolume: string;
  token1Volume24H: string;
  totalVolumeUSD: string;
  tvlUSD: string;
  tvlUSDChange24H: string;
  txCount24H: number;
  volumeUSD7D: string;
  volumeUSD24H: string;
};
