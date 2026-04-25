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
