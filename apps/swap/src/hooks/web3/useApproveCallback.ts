import { ERC20Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useHasPendingApproval, useTransactionAdder } from "store/transactions/hooks";
import { TransactionType } from "store/transactions/types";
import type { TransactionResponse } from "@ethersproject/providers";

import { Null } from "@icpswap/types";
import { ApprovalState, useApproval } from "./useERC20Approve";

function useGetAndTrackApproval(getApproval: ReturnType<typeof useApproval>[1]) {
  const addTransaction = useTransactionAdder();
  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        if ("response" in pending) {
          const { response, tokenAddress, spenderAddress: spender, amount } = pending;
          addTransaction(response, {
            type: TransactionType.APPROVAL,
            tokenAddress,
            spender,
            amount,
          });
        }
      }
      return pending;
    });
  }, [addTransaction, getApproval]);
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: string,
  token?: ERC20Token | Null,
  spender?: string,
): [
  ApprovalState,
  () => Promise<
    | {
        response: TransactionResponse;
        tokenAddress: string;
        spenderAddress: string;
        amount: string;
      }
    | {
        error: string;
      }
    | undefined
  >,
] {
  const [approval, getApproval] = useApproval(amountToApprove, token, spender, useHasPendingApproval);

  return [approval, useGetAndTrackApproval(getApproval)];
}

export { ApprovalState };
