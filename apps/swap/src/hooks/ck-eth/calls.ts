import { useEffect } from "react";
import { chainKeyETHMinter } from "@icpswap/actor";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUserWithdrawTxs, useUpdateUserWithdrawTx } from "store/web3/hooks";
import { TxState } from "types/ckETH";
import { MINTER_ID } from "constants/ckETH";

export function isEndedState(state: TxState) {
  return !(state !== "TxFinalized");
}

export function useFetchUserTxStates() {
  const principal = useAccountPrincipalString();
  const txs = useUserWithdrawTxs(principal);
  const updateUserTx = useUpdateUserWithdrawTx();

  useEffect(() => {
    async function call() {
      if (txs && txs.length && !!principal) {
        for (let i = 0; i < txs.length; i++) {
          const transactions = txs[i];
          const block_index = BigInt(transactions.block_index);

          const res = await (await chainKeyETHMinter(MINTER_ID)).retrieve_eth_status(block_index);
          updateUserTx(principal, block_index, res, undefined);
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, 10000);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [txs, principal]);
}
