import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Erc20DissolveTx, TX } from "types/web3";
import type { RetrieveEthStatus, TxState, EthTransaction, TxFinalizedStatus } from "types/ckETH";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import {
  updateEthMintTx,
  updateEthDissolveTX,
  updateErc20TX,
  updateEthereumTxResponse,
  updateErc20DissolveTx,
  updateBitcoinTxResponse,
  updateEthereumFinalizedHashes,
} from "store/web3/actions";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import store from "store/index";
import { BitcoinTxResponse } from "types/ckBTC";
import { useEthereumConfirmationsCallback } from "hooks/ck-bridge/useEthereumConfirmations";
import { isEthereumMintFinalizedByConfirmations } from "utils/web3/dissolve";

export function useUpdateEthMintTx() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, tx: TX) => {
      dispatch(updateEthMintTx({ principal, tx }));
    },
    [dispatch],
  );
}

export function useEthMintTxs() {
  const principal = useAccountPrincipalString();
  const states = useAppSelector((state) => state.web3.tx);

  return useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;
    return states[principal];
  }, [principal, states]);
}

export function useEthUnTxFinalizedTxs() {
  const principal = useAccountPrincipalString();
  const allEthMintTxs = useEthMintTxs();
  const allTxsResponse = store.getState().web3.ethTxResponse;
  const getConfirmations = useEthereumConfirmationsCallback();

  return useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(allEthMintTxs)) return undefined;

    const allUserTxsResponse = allTxsResponse[principal];

    return allEthMintTxs.filter((tx) => {
      const txResponse = allUserTxsResponse[tx.hash];
      if (!txResponse) return true;
      const confirmations = getConfirmations(txResponse);

      // The ethereum block number is not fetch yey, the confirmations is undefined when reload the page
      // If confirmations is undefined and you return false, it will cause events to display with a delay.
      // If confirmations is undefined and you return true, it will cause events to appear briefly and disappear when the page refreshes.
      return nonUndefinedOrNull(confirmations) ? !isEthereumMintFinalizedByConfirmations(confirmations) : false;
    });
  }, [principal, getConfirmations, allEthMintTxs, allTxsResponse]);
}

export function useUpdateEthereumTxResponse() {
  const dispatch = useAppDispatch();
  const principal = useAccountPrincipalString();

  return useCallback(
    (hash: string, response: TransactionResponse) => {
      if (isUndefinedOrNull(principal)) return;

      dispatch(
        updateEthereumTxResponse({
          principal,
          hash,
          response,
        }),
      );
    },
    [dispatch, principal],
  );
}

export function useEthTxResponse(hash: string | undefined) {
  const principal = useAccountPrincipalString();
  const allEthTxResponses = useAppSelector((state) => state.web3.ethTxResponse);

  return useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(hash)) return undefined;
    return allEthTxResponses[principal]?.[hash];
  }, [principal, allEthTxResponses, hash]);
}

export function getEthereumTxResponse(hash: string) {
  const principal = store.getState().auth.principal;
  const ethereumTxResponses = store.getState().web3.ethTxResponse;

  if (isUndefinedOrNull(principal)) return undefined;
  return ethereumTxResponses[principal]?.[hash];
}

export function useUpdateEthDissolveTx() {
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
        updateEthDissolveTX({
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

export function useEthDissolveTxs() {
  const principal = useAccountPrincipalString();
  const states = useAppSelector((state) => state.web3.withdrawTx);

  return useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;
    return states[principal];
  }, [principal, states]);
}

export function useEthDissolveTx(hash: string | undefined) {
  const principal = useAccountPrincipalString();
  const states = useAppSelector((state) => state.web3.withdrawTx);

  return useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(hash)) return undefined;
    return states[principal].find((transaction) => transaction.hash === hash);
  }, [principal, states, hash]);
}

export function useUpdateErc20MintTX() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, ledger: string, tx: TX) => {
      dispatch(updateErc20TX({ principal, ledger_id: ledger, tx }));
    },
    [dispatch],
  );
}

export function useErc20MintTxs(ledger: string | undefined) {
  const principal = useAccountPrincipalString();
  const states = useAppSelector((state) => state.web3.erc20Transactions);

  return useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(ledger)) return undefined;
    return states[`${principal}_${ledger}`];
  }, [principal, states, ledger]);
}

export function useErc20AllMintTxs() {
  const principal = useAccountPrincipalString();
  const erc20Transactions = useAppSelector((state) => state.web3.erc20Transactions);

  return useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;

    let txs: TX[] = [];

    Object.keys(erc20Transactions).forEach((key) => {
      if (key.includes(principal)) {
        txs = txs.concat(
          erc20Transactions[key].map((erc20Transaction) => {
            const ledger = key.split("_")?.[1];

            return {
              ...erc20Transaction,
              ledger,
            };
          }),
        );
      }
    });

    return txs;
  }, [principal, erc20Transactions]);
}

export function useErc20MintTx() {
  const states = useAppSelector((state) => state.web3.erc20Transactions);
  const principal = useAccountPrincipalString();

  return useMemo(() => {
    if (principal && states) {
      let currentUserTxs: TX[] = [];

      Object.keys(states).forEach((key) => {
        if (key.includes(principal)) {
          const ledger = key.split("_")[1];
          const txs = states[key];
          currentUserTxs = currentUserTxs.concat(txs.map((tx) => ({ ...tx, ledger })));
        }
      });

      return currentUserTxs;
    }

    return undefined;
  }, [principal, states]);
}

export function useErc20UnTxFinalizedTxs() {
  const principal = useAccountPrincipalString();
  const allMintTxs = useErc20AllMintTxs();
  const allTxsResponse = store.getState().web3.ethTxResponse;
  const getConfirmations = useEthereumConfirmationsCallback();

  return useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(allMintTxs)) return undefined;

    const allUserTxsResponse = allTxsResponse[principal];

    const unFinalizedTxs = allMintTxs.filter((tx) => {
      if (!allUserTxsResponse) return true;
      const txResponse = allUserTxsResponse[tx.hash];
      if (!txResponse) return true;

      const confirmations = getConfirmations(txResponse);

      // The ethereum block number is not fetch yey, the confirmations is undefined when reload the page
      // If confirmations is undefined and you return false, it will cause events to display with a delay.
      // If confirmations is undefined and you return true, it will cause events to appear briefly and disappear when the page refreshes.
      return nonUndefinedOrNull(confirmations) ? !isEthereumMintFinalizedByConfirmations(confirmations) : false;
    });

    return unFinalizedTxs;
  }, [principal, getConfirmations, allMintTxs, allTxsResponse]);
}

export function useUpdateErc20DissolveTx() {
  const dispatch = useAppDispatch();

  return useCallback(
    (tx: Erc20DissolveTx) => {
      dispatch(updateErc20DissolveTx({ tx }));
    },
    [dispatch],
  );
}

export function useErc20DissolveTxs() {
  const principal = useAccountPrincipalString();
  const erc20DissolveTxs = useAppSelector((state) => state.web3.erc20DissolveTxs);

  return useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;
    return erc20DissolveTxs.filter((dissolveTx) => !!dissolveTx && dissolveTx.from === principal);
  }, [principal, erc20DissolveTxs]);
}

export function useUpdateBitcoinTxResponse() {
  const dispatch = useAppDispatch();
  const principal = useAccountPrincipalString();

  return useCallback(
    (hash: string, response: BitcoinTxResponse) => {
      if (isUndefinedOrNull(principal)) return;

      dispatch(
        updateBitcoinTxResponse({
          principal,
          hash,
          response,
        }),
      );
    },
    [dispatch, principal],
  );
}

export function useBitcoinAllTxResponse() {
  const principal = useAccountPrincipalString();
  const allBitcoinTxResponse = useAppSelector((state) => state.web3.bitcoinTxResponse);

  return useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;
    return allBitcoinTxResponse[principal];
  }, [principal, allBitcoinTxResponse]);
}

export function useBitcoinTxResponse(hash: string | undefined) {
  const allBitcoinTxResponse = useBitcoinAllTxResponse();

  return useMemo(() => {
    if (isUndefinedOrNull(hash)) return undefined;
    return allBitcoinTxResponse?.[hash];
  }, [allBitcoinTxResponse, hash]);
}

export function useEthereumFinalizedHashesManager(): [Array<string>, (hash: string) => void] {
  const ethereumFinalizedHashes = useAppSelector((state) => state.web3.ethereumFinalizedHashes);

  const dispatch = useAppDispatch();

  const callback = useCallback(
    (hash: string) => {
      dispatch(updateEthereumFinalizedHashes(hash));
    },
    [dispatch],
  );

  return useMemo(() => [ethereumFinalizedHashes, callback], [callback, ethereumFinalizedHashes]);
}
