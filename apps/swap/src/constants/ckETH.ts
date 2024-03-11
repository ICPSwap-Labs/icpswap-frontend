import { ChainId } from "constants/web3";

export const chain = ChainId.Mainnet;

const API_LINKS = {
  [ChainId.Mainnet]: "https://api.etherscan.io/api",
  [ChainId.SepoliaTestnet]: "https://api-sepolia.etherscan.io/api",
};

const LEDGER_ID = {
  [ChainId.Mainnet]: "ss2fx-dyaaa-aaaar-qacoq-cai",
  [ChainId.SepoliaTestnet]: "apia6-jaaaa-aaaar-qabma-cai",
};

const MINTER_ID = {
  [ChainId.Mainnet]: "sv3dd-oaaaa-aaaar-qacoa-cai",
  [ChainId.SepoliaTestnet]: "jzenf-aiaaa-aaaar-qaa7q-cai",
};

const DASHBOARD = {
  [ChainId.Mainnet]: `https://dashboard.internetcomputer.org/ethereum`,
  [ChainId.SepoliaTestnet]: `https://${MINTER_ID[ChainId.SepoliaTestnet]}.raw.icp0.io/dashboard`,
};

const CANISTER = {
  [ChainId.Mainnet]: `https://icscan.io/canister/${LEDGER_ID[chain]}`,
  [ChainId.SepoliaTestnet]: `https://icscan.io/canister/${LEDGER_ID[chain]}`,
};

const EXPLORER_TX_LINKS = {
  [ChainId.Mainnet]: `https://etherscan.io/tx`,
  [ChainId.SepoliaTestnet]: `https://sepolia.etherscan.io/tx`,
};

const EXPLORER_BLOCK_LINKS = {
  [ChainId.Mainnet]: `https://etherscan.io/block`,
  [ChainId.SepoliaTestnet]: `https://sepolia.etherscan.io/block`,
};

const EXPLORER_ADDRESS_LINKS = {
  [ChainId.Mainnet]: `https://etherscan.io/address`,
  [ChainId.SepoliaTestnet]: `https://sepolia.etherscan.io/address`,
};

const EXPLORER_CONTRACT_LINKS = {
  [ChainId.Mainnet]: `https://etherscan.io/address`,
  [ChainId.SepoliaTestnet]: `https://sepolia.etherscan.io/address`,
};

const ETH_MINT_CONTRACTS = {
  [ChainId.Mainnet]: `0x7574eb42ca208a4f6960eccafdf186d627dcc175`,
  [ChainId.SepoliaTestnet]: `0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34`,
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
