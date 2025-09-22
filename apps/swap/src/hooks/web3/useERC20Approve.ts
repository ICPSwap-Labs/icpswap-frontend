/* eslint-disable no-else-return */
import { MaxUint256 } from "@ethersproject/constants";
import type { TransactionResponse } from "@ethersproject/providers";
import { ERC20Token } from "@icpswap/swap-sdk";
import { useAccount, useChainId } from "wagmi";
import { useERC20Contract } from "hooks/web3/useContract";
import { useCallback, useMemo } from "react";
import { calculateGasMargin } from "utils/web3/calculateGasMargin";
import { useERC20TokenAllowance } from "hooks/web3/useERC20Allowance";
import BigNumber from "bignumber.js";
import { Null } from "@icpswap/types";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

function useApprovalStateForSpender(
  amountToApprove: string | Null,
  token: ERC20Token | Null,
  spender: string | Null,
  useIsPendingApproval: (token?: ERC20Token | Null, spender?: string | Null) => boolean,
): ApprovalState {
  const { address: account } = useAccount();

  const pendingApproval = useIsPendingApproval(token, spender);
  const { tokenAllowance } = useERC20TokenAllowance(token, account ?? undefined, spender, pendingApproval);

  return useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;

    // we might not have enough data to know whether or not we need to approve
    if (!tokenAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if tokenAllowance is
    return new BigNumber(tokenAllowance).isLessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, pendingApproval, spender, tokenAllowance]);
}

export function useApproval(
  amountToApprove: string | Null,
  token: ERC20Token | Null,
  spender: string | Null,
  useIsPendingApproval: (token?: ERC20Token | Null, spender?: string | Null) => boolean,
): [
  ApprovalState,
  () => Promise<
    | { response: TransactionResponse; tokenAddress: string; spenderAddress: string; amount: string }
    | undefined
    | {
        error: string;
      }
  >,
] {
  const chainId = useChainId();

  // check the current approval status
  const approvalState = useApprovalStateForSpender(amountToApprove, token, spender, useIsPendingApproval);

  const tokenContract = useERC20Contract(token?.address);

  const approve = useCallback(async () => {
    function logFailure(error: Error | string) {
      console.warn(`${token?.symbol || "Token"} approval failed:`, error);
      return undefined;
    }

    // Bail early if there is an issue.
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      return logFailure("approve was called unnecessarily");
    } else if (!chainId) {
      return logFailure("no chainId");
    } else if (!token) {
      return logFailure("no token");
    } else if (!tokenContract) {
      return logFailure("tokenContract is null");
    } else if (!amountToApprove) {
      return logFailure("missing amount to approve");
    } else if (!spender) {
      return logFailure("no spender");
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens which restrict approval amounts
      useExact = true;
      return tokenContract.estimateGas.approve(spender, amountToApprove);
    });

    return tokenContract
      .approve(spender, useExact ? amountToApprove : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response) => {
        return {
          response,
          tokenAddress: token.address,
          spenderAddress: spender,
          amount: amountToApprove,
        };
      })
      .catch((error: Error) => {
        logFailure(error);

        return {
          error: String(error),
        };
      });
  }, [approvalState, token, tokenContract, amountToApprove, spender, chainId]);

  return [approvalState, approve];
}
