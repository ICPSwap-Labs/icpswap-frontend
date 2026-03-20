import { depositAndSwap, depositFromAndSwap } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { type Null, ResultStatus, type TOKEN_STANDARD } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { getTokenActualTransferRawAmount, useSwapApprove, useSwapTransfer } from "hooks/swap/index";
import { allowance } from "hooks/token";
import { MessageTypes, TIP_SUCCESS, useTips } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { useCallback } from "react";
import { useAccountPrincipal, useAccountPrincipalString } from "store/auth/hooks";
import { isUseTransfer } from "utils/token/index";

export interface UseTransferOrApproveProps {
  amount: string;
  inputAllowance: bigint | Null;
  poolId: string;
  token: Token;
}

export function useTransferOrApprove() {
  const principal = useAccountPrincipal();
  const approve = useSwapApprove();
  const transfer = useSwapTransfer();

  return useCallback(
    async ({ amount, inputAllowance, poolId, token }: UseTransferOrApproveProps) => {
      if (!principal) return false;

      // if use transfer, need 2 multiply fee to transfer and deposit
      // if use approve, allowance is not enough need 2 multiply fee, if allowance is enough, need 1 multiply fee
      if (isUseTransfer(token)) {
        const actualSwapAmount = new BigNumber(amount).minus(token.transFee * 2).toString();
        return await transfer(token, getTokenActualTransferRawAmount(actualSwapAmount, token), poolId);
      }

      if (isUndefinedOrNull(inputAllowance)) return false;

      if (new BigNumber(amount).isLessThanOrEqualTo(inputAllowance.toString())) return true;

      return await approve({
        token,
        amount,
        poolId,
        standard: token.standard as TOKEN_STANDARD,
      });
    },
    [principal],
  );
}

export interface UseSwapCallbackProps {
  amount: string;
  inputAllowance: bigint | Null;
  poolId: string;
  token: Token;
}

export function useSwapCallback() {
  const principal = useAccountPrincipal();
  const [openTip] = useTips();

  return useCallback(
    async ({ amount, inputAllowance, poolId, token }: UseSwapCallbackProps) => {
      if (!principal) return false;
      if (!isUseTransfer(token) && isUndefinedOrNull(inputAllowance)) return false;

      const outputToken = ICP;

      if (!principal || !amount) return false;

      // if use transfer, need 2 multiply fee to transfer and deposit
      // if use approve, allowance is not enough need 2 multiply fee, if allowance is enough, need 1 multiply fee
      const actualSwapAmount = isUseTransfer(token)
        ? new BigNumber(amount).minus(token.transFee * 2).toString()
        : new BigNumber(amount).isLessThanOrEqualTo((inputAllowance ?? BigInt(0)).toString())
          ? new BigNumber(amount).minus(token.transFee * 1).toString()
          : new BigNumber(amount).minus(token.transFee * 2).toString();

      const { status, message } = isUseTransfer(token)
        ? await depositAndSwap(poolId, {
            zeroForOne: token.address < outputToken.address,
            amountIn: actualSwapAmount,
            amountOutMinimum: "0",
            tokenInFee: BigInt(token.transFee),
            tokenOutFee: BigInt(outputToken.transFee),
          })
        : await depositFromAndSwap(poolId, {
            zeroForOne: token.address < outputToken.address,
            amountIn: actualSwapAmount,
            amountOutMinimum: "0",
            tokenInFee: BigInt(token.transFee),
            tokenOutFee: BigInt(outputToken.transFee),
          });

      if (status === ResultStatus.ERROR) {
        openTip(getLocaleMessage(message), MessageTypes.error);
      }

      const swapOk = status === ResultStatus.OK;

      if (swapOk) {
        openTip(`Swap ${token.symbol} successfully`, TIP_SUCCESS);
      }

      return swapOk;
    },
    [principal],
  );
}

export interface SwapCallbackArgs {
  balance: string;
  tokenId: string;
  poolId: string;
  token: Token;
}

export function useConvertSwap() {
  const principal = useAccountPrincipalString();
  const approveOrTransfer = useTransferOrApprove();
  const swap = useSwapCallback();

  return useCallback(
    async ({ balance, token, poolId }: SwapCallbackArgs) => {
      if (isUndefinedOrNull(principal)) return false;

      let inputAllowance: bigint | undefined;

      if (!isUseTransfer(token)) {
        inputAllowance = await allowance({ canisterId: token.address, spender: poolId, owner: principal });
      }

      const result = await approveOrTransfer({ amount: balance, inputAllowance, poolId, token });

      if (result === false) return false;

      return await swap({ amount: balance, inputAllowance, poolId, token });
    },
    [principal, approveOrTransfer],
  );
}
