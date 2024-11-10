import { ResultStatus, TOKEN_STANDARD } from "@icpswap/types";
import { Position } from "@icpswap/swap-sdk";
import { updateUserPositionPoolId, placeOrder as __placeOrder } from "@icpswap/hooks";
import { useCallback } from "react";
import {
  useSwapApprove,
  useSwapDeposit,
  useSwapTransfer,
  getTokenActualTransferRawAmount,
  getTokenActualDepositRawAmount,
  getTokenInsufficient,
} from "hooks/swap/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import { isUseTransfer } from "utils/token/index";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { isNullArgs, BigNumber } from "@icpswap/utils";
import { mint as __mint } from "hooks/swap/v3Calls";
import { useUpdateUserPositionPools } from "store/hooks";
import { useUpdatePlaceOrderPositionId, getPlaceOrderPositionId } from "store/swap/limit-order/hooks";
import { t } from "@lingui/macro";

interface PlaceOrderCallsArgs {
  position: Position;
  openExternalTip: OpenExternalTip;
  stepKey: string;
  token0Balance: BigNumber;
  token1Balance: BigNumber;
  token0SubAccountBalance: BigNumber;
  token1SubAccountBalance: BigNumber;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
  limitLick: bigint;
}

export function usePlaceOrderCalls() {
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();

  const updateStoreUserPositionPool = useUpdateUserPositionPools();
  const updatePlaceOrderPositionId = useUpdatePlaceOrderPositionId();

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

      const approveToken0 = async () => {
        const token0 = position.pool.token0;

        if (token0Insufficient === "NO_TRANSFER_APPROVE" || token0Insufficient === "NEED_DEPOSIT") return true;

        if (amount0Desired !== "0") {
          return await approve({
            token: token0,
            amount: amount0Desired,
            poolId,
            standard: token0.standard as TOKEN_STANDARD,
          });
        }

        return true;
      };

      const approveToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE" || token1Insufficient === "NEED_DEPOSIT") return true;

        if (amount1Desired !== "0") {
          return await approve({
            token: token1,
            amount: amount1Desired,
            poolId,
            standard: token1.standard as TOKEN_STANDARD,
          });
        }

        return true;
      };

      const transferToken0 = async () => {
        if (token0Insufficient === "NO_TRANSFER_APPROVE" || token0Insufficient === "NEED_DEPOSIT") return true;

        if (amount0Desired !== "0") {
          return await transfer(
            token0,
            getTokenActualTransferRawAmount(
              new BigNumber(amount0Desired)
                .minus(unusedBalance.balance0.toString())
                .minus(token0SubAccountBalance)
                .toString(),
              token0,
            ),
            poolId,
          );
        }

        return true;
      };

      const transferToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE" || token1Insufficient === "NEED_DEPOSIT") return true;

        if (amount1Desired !== "0") {
          return await transfer(
            token1,
            getTokenActualDepositRawAmount(
              new BigNumber(amount1Desired)
                .minus(unusedBalance.balance1.toString())
                .minus(token1SubAccountBalance)
                .toString(),
              token1,
            ),
            poolId,
          );
        }

        return true;
      };

      const depositToken0 = async () => {
        if (token0Insufficient === "NO_TRANSFER_APPROVE") return true;
        if (amount0Desired === "0") return true;

        // Mins 1 token fee by backend, so the deposit amount should add 1 token fee if use deposit
        return await deposit({
          token: token0,
          amount: getTokenActualDepositRawAmount(
            new BigNumber(amount0Desired).minus(unusedBalance.balance0.toString()).toString(),
            token0,
          ),
          poolId,
          openExternalTip: ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey, poolId });
          },
          standard: token0.standard as TOKEN_STANDARD,
        });
      };

      const depositToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE") return true;
        if (amount1Desired === "0") return true;

        return await deposit({
          token: token1,
          amount: getTokenActualDepositRawAmount(
            new BigNumber(amount1Desired).minus(unusedBalance.balance1.toString()).toString(),
            token1,
          ),
          poolId,
          openExternalTip: ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey, poolId });
          },
          standard: token1.standard as TOKEN_STANDARD,
        });
      };

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
          updateUserPositionPoolId(poolId, true);
          updateStoreUserPositionPool([poolId]);
          updatePlaceOrderPositionId(data);

          return true;
        }

        if (status === "err") {
          openExternalTip({ message: getLocaleMessage(message), tipKey: stepKey });
          return false;
        }

        return false;
      };

      const placeOrder = async () => {
        const positionId = getPlaceOrderPositionId();
        if (isNullArgs(positionId)) return false;
        const { status, message } = await __placeOrder(poolId, positionId, limitLick);
        if (status === ResultStatus.OK) {
          openSuccessTip(t`Add limit order successfully`);
        } else {
          openErrorTip(message ?? t`Failed to add limit order`);
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
    [updatePlaceOrderPositionId],
  );
}
