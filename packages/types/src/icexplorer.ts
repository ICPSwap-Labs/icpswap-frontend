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
