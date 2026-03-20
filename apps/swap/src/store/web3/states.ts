import type { WithdrawalDetail } from "@icpswap/types";
import type { BitcoinTxResponse } from "types/ckBTC";
import type { DissolveTx } from "types/ckETH";
import type { TX } from "types/web3";
import type { TransactionReceipt } from "viem";

export interface Web3State {
  tx: { [principal: string]: TX[] };
  ethTxResponse: {
    [principal: string]: {
      [hash: string]: TransactionReceipt;
    };
  };
  withdrawTx: { [principal: string]: DissolveTx[] };
  erc20Transactions: { [principal_ledger: string]: TX[] };
  bitcoinTxResponse: {
    [principal: string]: {
      [hash: string]: BitcoinTxResponse;
    };
  };
  ethereumFinalizedHashes: string[];
  erc20DissolveDetails: {
    [withdrawal_id: string]: WithdrawalDetail;
  };
  erc20DissolveCompletedTxs: string[];
  bitcoinFinalizedTxs: string[];
}

export const initialState: Web3State = {
  tx: {},
  withdrawTx: {},
  erc20Transactions: {},
  ethTxResponse: {},
  bitcoinTxResponse: {},
  ethereumFinalizedHashes: [],
  erc20DissolveDetails: {},
  erc20DissolveCompletedTxs: [],
  bitcoinFinalizedTxs: [],
};
