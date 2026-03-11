export type {
  WithdrawErc20Arg,
  WithdrawErc20Error,
  RetrieveErc20Request,
  WithdrawalSearchParameter,
  WithdrawalDetail,
  WithdrawalStatus,
  EthTransaction,
  TxFinalizedStatus,
  ChainKeyETHMinterInfo,
  Eip1559TransactionPrice,
  RetrieveEthStatus,
  RetrieveBtcStatus,
  DogeUtxoStatus,
} from "@icpswap/candid";

export type DogeTransaction = {
  addresses: string[];
  block_hash: string;
  block_height: number;
  block_index: number;
  confidence: number;
  confirmations: number;
  confirmed: string;
  double_spend: boolean;
  fees: number;
  hash: string;
  inputs: Array<{
    addresses: string[];
    age: number;
    output_index: number;
    output_value: number;
    prev_hash: string;
    script: string;
    script_type: string;
    sequence: number;
  }>;
  outputs: Array<{
    addresses: string[];
    script: string;
    script_type: string;
    value: number;
  }>;
  preference: string;
  received: string;
  relayed_by: string;
  size: number;
  total: number;
  ver: number;
  vin_sz: number;
  vout_sz: number;
};
