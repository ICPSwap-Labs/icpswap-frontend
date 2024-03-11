export type Allowance = {
  spender: string;
  tokenIndex: number;
};

export interface Stat {
  totalVolume: bigint;
  totalTurnover: bigint;
  avgPrice: bigint;
  maxPrice: bigint;
  minPrice: bigint;
  listSize: bigint;
}
