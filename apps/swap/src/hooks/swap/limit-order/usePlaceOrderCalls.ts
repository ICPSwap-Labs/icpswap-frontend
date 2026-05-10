import { placeOrder as __placeOrder } from "@icpswap/hooks";
import type { Position } from "@icpswap/swap-sdk";
import { ResultStatus } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { getTokenInsufficient } from "hooks/swap/index";
import { mint as __mint } from "hooks/swap/v3Calls";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateUserPositionPools } from "store/hooks";
import type { OpenExternalTip } from "types/index";
import { isUseTransfer } from "utils/token/index";
import { useLimitApprove } from "hooks/swap/limit-order/usePlaceOrderApprove";
import { useLimitTransfer } from "hooks/swap/limit-order/usePlaceOrderTransfer";
import { useLimitDeposit } from "hooks/swap/limit-order/usePlaceOrderDeposit";

interface PlaceOrderCallsArgs {
  position: Position;
  openExternalTip: OpenExternalTip;
  stepKey: string;
  token0Balance: string;
  token1Balance: string;
  token0SubAccountBalance: string;
  token1SubAccountBalance: string;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
  limitLick: bigint;
}

export function usePlaceOrderCalls() {
  const { t } = useTranslation();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const limitDeposit = useLimitDeposit();
  const limitApprove = useLimitApprove();
  const limitTransfer = useLimitTransfer();

  const updateStoreUserPositionPool = useUpdateUserPositionPools();

  return useCallback(
    ({
      position,
      openExternalTip,
      stepKey,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
      limitLick,
    }: PlaceOrderCallsArgs) => {
      const { token0, token1, id: poolId } = position.pool;
      const amount0Desired = position.mintAmounts.amount0.toString();
      const amount1Desired = position.mintAmounts.amount1.toString();

      // The position that generate from mint may be used in place order,
      // so we need to store the position id in store after mint, and use it in place order.
      let positionIdToPlaceOrder: bigint | undefined;

      const token0Insufficient = getTokenInsufficient({
        token: token0,
        subAccountBalance: token0SubAccountBalance,
        balance: token0Balance,
        formatTokenAmount: amount0Desired,
        unusedBalance: unusedBalance.balance0,
      });

      const token1Insufficient = getTokenInsufficient({
        token: token1,
        subAccountBalance: token1SubAccountBalance,
        balance: token1Balance,
        formatTokenAmount: amount1Desired,
        unusedBalance: unusedBalance.balance1,
      });

      const approveToken0 = limitApprove({
        poolId,
        token: token0,
        amount: amount0Desired,
        tokenInsufficient: token0Insufficient,
      });

      const approveToken1 = limitApprove({
        poolId,
        token: token1,
        amount: amount1Desired,
        tokenInsufficient: token1Insufficient,
      });

      const transferToken0 = limitTransfer({
        token: token0,
        amount: amount0Desired,
        poolId,
        tokenInsufficient: token0Insufficient,
        unusedBalance: unusedBalance.balance0.toString(),
        subAccountBalance: token0SubAccountBalance,
      });

      const transferToken1 = limitTransfer({
        token: token1,
        amount: amount1Desired,
        poolId,
        tokenInsufficient: token1Insufficient,
        unusedBalance: unusedBalance.balance1.toString(),
        subAccountBalance: token1SubAccountBalance,
      });

      const depositToken0 = limitDeposit({
        token: token0,
        amount: amount0Desired,
        poolId,
        tokenInsufficient: token0Insufficient,
        unusedBalance: unusedBalance.balance0.toString(),
        openExternalTip,
        stepKey,
      });

      const depositToken1 = limitDeposit({
        token: token1,
        amount: amount1Desired,
        poolId,
        tokenInsufficient: token1Insufficient,
        unusedBalance: unusedBalance.balance1.toString(),
        openExternalTip,
        stepKey,
      });

      const mint = async () => {
        const { status, message, data } = await __mint(poolId, {
          token0: token0.address,
          token1: token1.address,
          fee: BigInt(position.pool.fee),
          tickLower: BigInt(position.tickLower),
          tickUpper: BigInt(position.tickUpper),
          amount0Desired,
          amount1Desired,
        });

        if (status === ResultStatus.OK) {
          updateStoreUserPositionPool([poolId]);
          positionIdToPlaceOrder = data;
          return true;
        }

        if (status === "err") {
          openExternalTip({ message: getLocaleMessage(message), tipKey: stepKey });
          return false;
        }

        return false;
      };

      const placeOrder = async () => {
        if (isUndefinedOrNull(positionIdToPlaceOrder)) return false;
        const { status, message } = await __placeOrder(poolId, positionIdToPlaceOrder, limitLick);
        if (status === ResultStatus.OK) {
          openSuccessTip(t`Add limit order successfully`);
        } else {
          openErrorTip(message ?? t("limit.failed.add"));
        }

        return status === ResultStatus.OK;
      };

      const token = new BigNumber(amount0Desired).isEqualTo(0) ? position.pool.token1 : position.pool.token0;

      return [
        ...(token.equals(position.pool.token0)
          ? [isUseTransfer(position.pool.token0) ? transferToken0 : approveToken0, depositToken0]
          : []),
        ...(token.equals(position.pool.token1)
          ? [isUseTransfer(position.pool.token1) ? transferToken1 : approveToken1, depositToken1]
          : []),
        mint,
        placeOrder,
      ].filter((fn) => fn !== undefined) as (() => Promise<boolean>)[];
    },
    [limitApprove, limitTransfer, limitDeposit, openErrorTip, openSuccessTip, t, updateStoreUserPositionPool],
  );
}
