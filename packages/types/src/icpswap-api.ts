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
