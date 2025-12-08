import { TX } from "types/web3";
import { DissolveTx } from "types/ckETH";
import { TransactionReceipt } from "viem";
import { BitcoinTxResponse } from "types/ckBTC";
import { WithdrawalDetail } from "@icpswap/types";

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
