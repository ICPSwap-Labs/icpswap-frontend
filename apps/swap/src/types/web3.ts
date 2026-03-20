import type { BridgeChainType, BridgeType } from "@icpswap/constants";

export type TX = {
  hash: string;
  from: string;
  to?: string;
  value: string;
  gas?: string;
  timestamp: string;
  block: string;
  ledger: string;
  tokenSymbol: string;
};

export type EthereumTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChainType;
  token: string;
};

export type Erc20DissolveTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChainType;
  token_symbol: string;
  withdrawal_id: string;
};

export type BitcoinTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChainType;
  token: string;
};

export type DogeTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChainType;
  token: string;
};

export type BridgeTransactionEvent =
  | Erc20DissolveTransactionEvent
  | EthereumTransactionEvent
  | BitcoinTransactionEvent
  | DogeTransactionEvent;

export type Erc20DissolveStatus = "TxFinalized" | "TxSent" | "TxCreated" | "Pending";
