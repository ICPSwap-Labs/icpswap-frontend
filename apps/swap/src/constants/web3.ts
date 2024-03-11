export const ETH_MINT_CHAIN = 1;

export const DEFAULT_CHAIN_ID = 1;

export enum ChainId {
  Mainnet = 1,
  SepoliaTestnet = 11155111,
}

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
