export type { RetrieveBtcStatus } from "@icpswap/types";

export type BTCAddressType = "deposit" | "withdraw";

export type BitcoinTxState = "Signing" | "Confirmed" | "Sending" | "AmountTooLow" | "Unknown" | "Submitted" | "Pending";

export type BitcoinTx = {
  principal: string;
  txid: string | undefined;
  state: BitcoinTxState;
  block_index: string;
  value: string;
  id: string;
};

type VOut = {
  scriptpubkey: string;
  scriptpubkey_address: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  value: number;
};

type VIn = {
  txid: string;
  vout: number;
  prevout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: 200000;
  };
  scriptsig: string;
  scriptsig_asm: string;
};

export type BitcoinTransaction = {
  fee: number;
  locktime: number;
  size: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  version: number;
  txid: string;
  weight: number;
  vout: VOut[];
  vin: VIn[];
};

export type BitcoinTxResponse = {
  block_height: number | null;
  block_index: number | null;
  double_spend: boolean;
  fee: number;
  hash: string;
  inputs: [];
  lock_time: number;
  out: [];
  relayed_by: string;
  size: number;
  time: number;
  tx_index: number;
  ver: number;
  vin_sz: number;
  vout_sz: number;
  weight: number;
};
