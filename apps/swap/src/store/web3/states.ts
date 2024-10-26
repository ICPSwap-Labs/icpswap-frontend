import { TX } from "types/web3";
import { StoredWithdrawTxValue } from "types/ckETH";

export interface Web3State {
  tx: { [principal: string]: TX[] };
  withdrawTx: { [principal: string]: StoredWithdrawTxValue[] };
  erc20Transactions: { [principal_ledger: string]: TX[] };
}

export const initialState: Web3State = {
  tx: {},
  withdrawTx: {},
  erc20Transactions: {},
};
