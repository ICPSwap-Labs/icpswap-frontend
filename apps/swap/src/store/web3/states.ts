import { TX } from "types/web3";
import { StoredWithdrawTxValue } from "types/ckETH";

export interface Web3State {
  tx: { [principal: string]: TX[] };
  withdrawTx: { [principal: string]: StoredWithdrawTxValue[] };
}

export const initialState: Web3State = {
  tx: {},
  withdrawTx: {},
};
