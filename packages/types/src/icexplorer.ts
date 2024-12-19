export type IcExplorerPagination<T> = {
  endRow: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  navigateFirstPage: number;
  navigateLastPage: number;
  navigatePages: number;
  nextPage: number;
  pageNum: number;
  pageSize: number;
  pages: number;
  prePage: number;
  size: number;
  startRow: string;
  total: string;
  list: T[];
};

export type IcExplorerResult<T> = {
  data: T;
  statusCode: number;
};

export type IcExplorerTokenHolderDetail = {
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

export type TokenHolerArgs = {
  isDesc: boolean;
  ledgerId: string;
  page: number;
  size: number;
};

export interface IcExplorerTokenDetail {
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
