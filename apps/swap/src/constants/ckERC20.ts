import { ChainId } from "@icpswap/constants";
import { EXPLORER_MAPS, chain, EXPLORER_BLOCK_LINKS, EXPLORER_TX_LINKS, getMinterDashboard } from "constants/web3";
import { ckUSDC } from "@icpswap/tokens";

const MINTER_ID = {
  [ChainId.MAINNET]: "sv3dd-oaaaa-aaaar-qacoa-cai",
  [ChainId.SEPOLIA]: "jzenf-aiaaa-aaaar-qaa7q-cai",
};

export const MINTER_CANISTER_ID = MINTER_ID[chain];

export const ERC20_MINTER_DASHBOARD = getMinterDashboard(MINTER_ID[chain]);

export const ckERC20LedgerDashboardLink = (ledger_id: string) =>
  `https://dashboard.internetcomputer.org/canister/${ledger_id}`;

export const EXPLORER_TX_LINK = EXPLORER_TX_LINKS[chain];

export const EXPLORER_BLOCK_LINK = EXPLORER_BLOCK_LINKS[chain];

export const EXPLORER_ADDRESS_LINK = EXPLORER_MAPS[chain];

export enum WithdrawalState {
  TxFinalized = "TxFinalized",
  TxSent = "TxSent",
  TxCreated = "TxCreated",
  Pending = "Pending",
}
