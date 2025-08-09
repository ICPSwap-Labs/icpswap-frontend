import { Erc20DissolveTx, TX } from "types/web3";
import { DissolveTx } from "types/ckETH";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BitcoinTxResponse } from "types/ckBTC";

export interface Web3State {
  tx: { [principal: string]: TX[] };
  ethTxResponse: {
    [principal: string]: {
      [hash: string]: TransactionResponse;
    };
  };
  withdrawTx: { [principal: string]: DissolveTx[] };
  erc20Transactions: { [principal_ledger: string]: TX[] };
  erc20DissolveTxs: Erc20DissolveTx[];
  bitcoinTxResponse: {
    [principal: string]: {
      [hash: string]: BitcoinTxResponse;
    };
  };
  ethereumFinalizedHashes: string[];
}

export const initialState: Web3State = {
  tx: {},
  withdrawTx: {},
  erc20Transactions: {},
  ethTxResponse: {},
  erc20DissolveTxs: [],
  bitcoinTxResponse: {},
  ethereumFinalizedHashes: [],
};
