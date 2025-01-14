import { ChainId } from "@icpswap/constants";
import { chain, EXPLORER_TX_LINKS, EXPLORER_BLOCK_LINKS, EXPLORER_MAPS } from "constants/web3";
import { ckETH as ckETHToken, ckSepoliaETH } from "@icpswap/tokens";

const API_LINKS = {
  [ChainId.MAINNET]: "https://api.etherscan.io/api",
  [ChainId.SEPOLIA]: "https://api-sepolia.etherscan.io/api",
};

const LEDGER_ID = {
  [ChainId.MAINNET]: "ss2fx-dyaaa-aaaar-qacoq-cai",
  [ChainId.SEPOLIA]: "apia6-jaaaa-aaaar-qabma-cai",
};

const MINTER_MAPS = {
  [ChainId.MAINNET]: "sv3dd-oaaaa-aaaar-qacoa-cai",
  [ChainId.SEPOLIA]: "jzenf-aiaaa-aaaar-qaa7q-cai",
};

const DASHBOARD = {
  [ChainId.MAINNET]: `https://dashboard.internetcomputer.org/ethereum`,
  [ChainId.SEPOLIA]: `https://${MINTER_MAPS[ChainId.SEPOLIA]}.raw.icp0.io/dashboard`,
};

const CANISTER = {
  [ChainId.MAINNET]: `https://dashboard.internetcomputer.org/canister/${LEDGER_ID[chain]}`,
  [ChainId.SEPOLIA]: `https://dashboard.internetcomputer.org/canister/${LEDGER_ID[chain]}`,
};

export const ckETH_LEDGER_ID = LEDGER_ID[chain];

export const MINTER_ID = MINTER_MAPS[chain];

export const ckETH_DASHBOARD = DASHBOARD[chain];

export const ckETH_CANISTER = CANISTER[chain];

export const API_LINK = API_LINKS[chain];

export const EXPLORER_TX_LINK = EXPLORER_TX_LINKS[chain];

export const EXPLORER_BLOCK_LINK = EXPLORER_BLOCK_LINKS[chain];

export const EXPLORER_ADDRESS_LINK = EXPLORER_MAPS[chain];

// export const EXPLORER_CONTRACT_LINK = `${EXPLORER_MAPS[chain]}/${ckETH_MINTER_CONTRACT}`;

export const DISSOLVE_FEE = "0.0000001";

export const MIN_WITHDRAW_AMOUNT = 30000000000000000;

export const ckETH = chain === ChainId.MAINNET ? ckETHToken : ckSepoliaETH;

export const bytesStringOfNullSubAccount = "0x0000000000000000000000000000000000000000000000000000000000000000";
