import { ChainId } from "@icpswap/constants";
import { EXPLORER_MAPS, chain } from "constants/web3";

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

const IC_DASHBOARD = {
  [ChainId.MAINNET]: `https://dashboard.internetcomputer.org/ethereum`,
  [ChainId.SEPOLIA]: `https://${MINTER_ID[ChainId.SEPOLIA]}.raw.icp0.io/dashboard`,
};

const MINTER_DASHBOARD = {
  [ChainId.MAINNET]: `https://${MINTER_ID[ChainId.SEPOLIA]}.raw.icp0.io/dashboard`,
  [ChainId.SEPOLIA]: `https://${MINTER_ID[ChainId.SEPOLIA]}.raw.icp0.io/dashboard`,
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

const CK_ERC20_HELPER_SMART_CONTRACTS = {
  [ChainId.MAINNET]: `0x7574eb42ca208a4f6960eccafdf186d627dcc175`,
  [ChainId.SEPOLIA]: `0x70e02Abf44E62Da8206130Cd7ca5279a8F6d6241`,
};

const CK_ERC20_MINTER_SMART_CONTRACTS = {
  [ChainId.MAINNET]: `0x7574eb42ca208a4f6960eccafdf186d627dcc175`,
  [ChainId.SEPOLIA]: `0x1789F79e95324A47c5Fd6693071188e82E9a3558`,
};

export const ckETH_LEDGER_ID = LEDGER_ID[chain];

export const ckETH_MINTER_ID = MINTER_ID[chain];

export const CK_ERC20_MINTER_DASHBOARD = MINTER_DASHBOARD[chain];

export const ckERC20LedgerDashboardLink = (ledger_id: string) =>
  `https://dashboard.internetcomputer.org/canister/${ledger_id}`;

export const CK_ERC20_HELPER_SMART_CONTRACT = CK_ERC20_HELPER_SMART_CONTRACTS[chain];

export const CK_ERC20_MINTER_SMART_CONTRACT = CK_ERC20_MINTER_SMART_CONTRACTS[chain];

export const API_LINK = API_LINKS[chain];

export const EXPLORER_TX_LINK = EXPLORER_TX_LINKS[chain];

export const EXPLORER_BLOCK_LINK = EXPLORER_BLOCK_LINKS[chain];

export const EXPLORER_ADDRESS_LINK = EXPLORER_ADDRESS_LINKS[chain];

export const ERC20_HELPER_SMART_CONTRACT_EXPLORER = `${EXPLORER_MAPS[chain]}/${CK_ERC20_HELPER_SMART_CONTRACT}`;

export const DISSOLVE_FEE = "0.0000001";

export const MIN_WITHDRAW_AMOUNT = 30000000000000000;
