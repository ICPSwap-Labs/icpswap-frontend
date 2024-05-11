import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { TX } from "types/web3";
import type { RetrieveEthStatus, TxState, EthTransaction, TxFinalizedStatus } from "types/ckETH";
import { updateTX, updateWithdrawTX, updateErc20TX } from "./actions";

export function useUpdateTX() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, tx: TX) => {
      dispatch(updateTX({ principal, tx }));
    },
    [dispatch],
  );
}

export function usePrincipalTX(principal: string | undefined) {
  const states = useAppSelector((state) => state.web3.tx);

  return useMemo(() => {
    if (principal && states) {
      return states[principal];
    }

    return undefined;
  }, [principal, states]);
}

export function useUpdateUserWithdrawTx() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, block_index: bigint, status: undefined | RetrieveEthStatus, value: string | undefined) => {
      let hash: string | undefined = "";

      if (status) {
        Object.keys(status).forEach((ele) => {
          if (ele === "TxSent") {
            hash = (status as { TxSent: EthTransaction })[ele].transaction_hash;
          } else if (ele === "TxFinalized") {
            const state = (status as { TxFinalized: TxFinalizedStatus }).TxFinalized;
            Object.keys(state).forEach((ele) => {
              if (ele === "Success") {
                hash = (state as { Success: EthTransaction })[ele].transaction_hash;
              } else if (ele === "Reimbursed") {
                hash = (
                  state as {
                    Reimbursed: {
                      transaction_hash: string;
                      reimbursed_amount: bigint;
                      reimbursed_in_block: bigint;
                    };
                  }
                ).Reimbursed.transaction_hash;
              } else {
                hash = (
                  state as {
                    PendingReimbursement: EthTransaction;
                  }
                ).PendingReimbursement.transaction_hash;
              }
            });
          }
        });
      }

      dispatch(
        updateWithdrawTX({
          principal,
          tx: {
            block_index: block_index.toString(),
            hash,
            state: (status ? Object.keys(status)[0] : "") as TxState,
            value: value ?? "",
          },
        }),
      );
    },
    [dispatch],
  );
}

export function useUserWithdrawTxs(principal: string | undefined) {
  const states = useAppSelector((state) => state.web3.withdrawTx);

  return useMemo(() => {
    if (principal && states) {
      return states[principal];
    }

    return undefined;
  }, [principal, states]);
}

export function useUpdateErc20TX() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, ledger: string, tx: TX) => {
      dispatch(updateErc20TX({ principal, ledger_id: ledger, tx }));
    },
    [dispatch],
  );
}

export function useUserErc20TX(principal: string | undefined, ledger: string | undefined) {
  const states = useAppSelector((state) => state.web3.erc20Transactions);

  return useMemo(() => {
    if (principal && ledger && states) {
      return states[`${principal}_${ledger}`];
    }

    return undefined;
  }, [principal, states, ledger]);
}
