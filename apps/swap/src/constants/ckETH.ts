import { ChainId } from "@icpswap/constants";
import { chain } from "constants/web3";
import { ckETH as ckETHToken, ckSepoliaETH } from "@icpswap/tokens";

const API_LINKS = {
  [ChainId.MAINNET]: "https://api.etherscan.io/api",
  [ChainId.SEPOLIA]: "https://api-sepolia.etherscan.io/api",
};

const LEDGER_ID = {
  [ChainId.MAINNET]: "ss2fx-dyaaa-aaaar-qacoq-cai",
  [ChainId.SEPOLIA]: "apia6-jaaaa-aaaar-qabma-cai",
};

const MINTER_ID = {
  [ChainId.MAINNET]: "sv3dd-oaaaa-aaaar-qacoa-cai",
  [ChainId.SEPOLIA]: "jzenf-aiaaa-aaaar-qaa7q-cai",
};

const DASHBOARD = {
  [ChainId.MAINNET]: `https://dashboard.internetcomputer.org/ethereum`,
  [ChainId.SEPOLIA]: `https://${MINTER_ID[ChainId.SEPOLIA]}.raw.icp0.io/dashboard`,
};

const CANISTER = {
  [ChainId.MAINNET]: `https://icscan.io/canister/${LEDGER_ID[chain]}`,
  [ChainId.SEPOLIA]: `https://icscan.io/canister/${LEDGER_ID[chain]}`,
};

const EXPLORER_TX_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/tx`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/tx`,
};

const EXPLORER_BLOCK_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/block`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/block`,
};

const EXPLORER_ADDRESS_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/address`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/address`,
};

const EXPLORER_CONTRACT_LINKS = {
  [ChainId.MAINNET]: `https://etherscan.io/address`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/address`,
};

const ETH_MINT_CONTRACTS = {
  [ChainId.MAINNET]: `0x7574eb42ca208a4f6960eccafdf186d627dcc175`,
  [ChainId.SEPOLIA]: `0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34`,
};

export const ckETH_LEDGER_ID = LEDGER_ID[chain];

export const ckETH_MINTER_ID = MINTER_ID[chain];

export const ckETH_DASHBOARD = DASHBOARD[chain];

export const ckETH_CANISTER = CANISTER[chain];

export const ckETH_MINTER_CONTRACT = ETH_MINT_CONTRACTS[chain];

export const API_LINK = API_LINKS[chain];

export const EXPLORER_TX_LINK = EXPLORER_TX_LINKS[chain];

export const EXPLORER_BLOCK_LINK = EXPLORER_BLOCK_LINKS[chain];

export const EXPLORER_ADDRESS_LINK = EXPLORER_ADDRESS_LINKS[chain];

export const EXPLORER_CONTRACT_LINK = `${EXPLORER_CONTRACT_LINKS[chain]}/${ckETH_MINTER_CONTRACT}`;

export const DISSOLVE_FEE = "0.0000001";

export const MIN_WITHDRAW_AMOUNT = 30000000000000000;

export const ckETH = chain === ChainId.MAINNET ? ckETHToken : ckSepoliaETH;
