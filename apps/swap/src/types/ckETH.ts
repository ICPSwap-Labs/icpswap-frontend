export type { RetrieveEthStatus, EthTransaction, TxFinalizedStatus } from "candid/ckETHMinter";

export type BTCAddressType = "deposit" | "withdraw";

export type TxState = "NotFound" | "TxFinalized" | "TxSent" | "TxCreated" | "Pending";

export type StoredWithdrawTxValue = { hash: string | undefined; state: TxState; block_index: string; value: string };

export type UserWithdrawTx = { hash: string | undefined; state: TxState; block_index: string };
