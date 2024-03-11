export interface EXTCollection {
  avatar: string;
  banner: string;
  blurb: string;
  brief: string;
  canister: string;
  collection: string;
  commission: number;
  description: string;
  detailpage: string;
  dev: boolean;
  discord: string;
  distrikt: string;
  dscvr: string;
  earn: boolean;
  external: boolean;
  filter: boolean;
  id: string;
  keywords: string;
  kyc: boolean;
  legacy: string;
  market: boolean;
  mature: boolean;
  medium: string;
  name: string;
  nftlicense: string;
  nftv: boolean;
  owner: string;
  priority: number;
  route: string;
  royalty: string;
  sale: boolean;
  saletype: string;
  standard: string;
  telegram: string;
  twitter: string;
  unit: string;
  web: string;
}

export interface ExtNft {
  id: string;
  owner: string;
  canister: string;
  price: number;
  time: number;
  metadata: string;
}
