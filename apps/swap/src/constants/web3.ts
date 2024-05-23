import { ChainId } from "@icpswap/constants";

export const chain: ChainId = ChainId.MAINNET;

export const ETH_MINT_CHAIN = 1;

export const DEFAULT_CHAIN_ID = 1;

export const SUPPORTED_CHAINS = [ChainId.MAINNET, ChainId.SEPOLIA];

export const chainIdToNetwork: { [network: number]: string } = {
  1: "Ethereum mainnet",
  3: "ropsten",
  4: "rinkeby",
  42: "kovan",
  97: "chapel", // BSC Testnet
  137: "polygon", // Polygon Mainnet
  80001: "mumbai", // Polygon Testnet
  43114: "avalanche", // Avalanche Mainnet
  43113: "fuji", // Avalanche Testnet
  11155111: "sepolia", // testnet
};

export const EXPLORER_MAPS = {
  [ChainId.MAINNET]: `https://etherscan.io/address`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/address`,
};

export const getExplorerAddress = (address: string) => {
  return `${EXPLORER_MAPS[chain]}/${address}`;
};

export const getMinterDashboard = (minterId: string) => {
  return `https://${minterId}.raw.icp0.io/dashboard`;
};

export const EXPLORER_TX_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/tx`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/tx`,
};

export const EXPLORER_BLOCK_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/block`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/block`,
};
