import { NFT_STANDARDS } from "@icpswap/constants";

export type Allowance = {
  spender: string;
  tokenIndex: number;
};

export type TradeOrder = {
  hash: string;
  cid: string;
  nftCid: string;
  tokenIndex: bigint;
  name: string;
  introduction: string;
  artistName: string;
  royalties: bigint;
  link: string;
  filePath: string;
  fileType: string;
  price: bigint;
  seller: string;
  minter: string;
  time: bigint;
};

export type TxRecord = {
  hash: string;
  cid: string;
  nftCid: string;
  tokenIndex: bigint;
  name: string;
  seller: string;
  buyer: string;
  minter: string;
  price: bigint;
  txFee: bigint;
  royaltiesFee: bigint;
  settleAmount: bigint;
  txStatus: string;
  txFeeStatus: string;
  royaltiesFeeStatus: string;
  settleAmountStatus: string;
  time: bigint;
  filePath: string;
  fileType: string;
};

export type NFTBuyRequest = {
  nftCid: string;
  tokenIndex: number;
};

export type SocialMedialLink = {
  label: string;
  value: string;
};
export interface CanisterCreateDetails {
  royalties: string;
  name: string;
  image: string;
  introduction: string;
  minter: string;
  socialMediaLinks: SocialMedialLink[];
}

export interface ImportedNFT {
  canisterId: string;
  standard: NFT_STANDARDS;
}
