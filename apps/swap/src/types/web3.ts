export type TX = {
  hash: string;
  from: string;
  to?: string;
  value: string;
  gas?: string;
  timestamp: string;
  block: string;
  ledger: string;
};

export type BridgeChain = "eth" | "btc" | "erc20";

export type BridgeType = "mint" | "dissolve";

export type EthereumTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChain;
  token: string;
};

export type Erc20DissolveTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChain;
  token_symbol: string;
  withdrawal_id: string;
};

export type BitcoinTransactionEvent = {
  hash: string | undefined;
  amount: string;
  type: BridgeType;
  chain: BridgeChain;
  token: string;
};

export type BridgeTransactionEvent = Erc20DissolveTransactionEvent | EthereumTransactionEvent | BitcoinTransactionEvent;

export type Erc20DissolveStatus = "TxFinalized" | "TxSent" | "TxCreated" | "Pending";
