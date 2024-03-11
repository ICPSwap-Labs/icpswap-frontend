export type { RetrieveBtcStatus } from "../candid/ckBTCMint";

export type BTCAddressType = "deposit" | "withdraw";

export type TxState = "Signing" | "Confirmed" | "Sending" | "AmountTooLow" | "Unknown" | "Submitted" | "Pending";

export type StoredTxValue = { txid: string; state: TxState; block_index: string; value: string };

export type UserTx = { txid: string; state: TxState; block_index: string };
