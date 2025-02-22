import { useCallback } from "react";
import { Position } from "@icpswap/swap-sdk";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getIncreaseLiquiditySteps } from "components/swap/IncreaseLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import {
  useSwapApprove,
  useSwapDeposit,
  useSwapTransfer,
  getTokenInsufficient,
  getTokenActualTransferRawAmount,
  getTokenActualDepositRawAmount,
} from "hooks/swap/index";
import { isUseTransfer } from "utils/token/index";
import { useSuccessTip } from "hooks/useTips";
import { increaseLiquidity } from "hooks/swap/v3Calls";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap";
import { TOKEN_STANDARD } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

export interface IncreaseLiquidityArgs {
  positionId: string;
  position: Position;
  poolId: string;
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
}

export function useIncreaseLiquidityCalls() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [openSuccessTip] = useSuccessTip();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();

  return useCallback(
    ({
      position,
      poolId,
      positionId,
      openExternalTip,
      stepKey,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
    }: IncreaseLiquidityArgs) => {
      const { token0, token1 } = position.pool;

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
        if (token0Insufficient === "NO_TRANSFER_APPROVE" || token0Insufficient === "NEED_DEPOSIT") return true;
        if (amount0Desired !== "0")
          return await approve({ token: position.pool.token0, amount: amount0Desired, poolId });
        return true;
      };

      const approveToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE" || token1Insufficient === "NEED_DEPOSIT") return true;
        if (amount1Desired !== "0")
          return await approve({ token: position.pool.token1, amount: amount1Desired, poolId });
        return true;
      };

      const transferToken0 = async () => {
        if (token0Insufficient === "NO_TRANSFER_APPROVE" || token0Insufficient === "NEED_DEPOSIT") return true;
        if (amount0Desired !== "0")
          return await transfer(
            token0,
            getTokenActualTransferRawAmount(
              new BigNumber(amount0Desired)
                .minus(unusedBalance.balance0.toString())
                .minus(token0SubAccountBalance)
                .toString(),
              token0,
            ).toString(),
            poolId,
          );
        return true;
      };

      const transferToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE" || token1Insufficient === "NEED_DEPOSIT") return true;
        if (amount1Desired !== "0")
          return await transfer(
            token1,
            getTokenActualTransferRawAmount(
              new BigNumber(amount1Desired)
                .minus(unusedBalance.balance1.toString())
                .minus(token1SubAccountBalance)
                .toString(),
              token1,
            ),
            poolId,
          );
        return true;
      };

      const depositToken0 = async () => {
        if (token0Insufficient === "NO_TRANSFER_APPROVE") return true;

        if (amount0Desired !== "0") {
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
        }
        return true;
      };

      const depositToken1 = async () => {
        if (token1Insufficient === "NO_TRANSFER_APPROVE") return true;

        if (amount1Desired !== "0") {
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
        }
        return true;
      };

      const _increaseLiquidity = async () => {
        if (!position || !principal) return false;

        const { status, message } = await increaseLiquidity(poolId, {
          positionId: BigInt(positionId),
          amount0Desired,
          amount1Desired,
        });

        if (status === "ok") {
          openSuccessTip(t("liquidity.add.success"));
        } else {
          openExternalTip({ message: getLocaleMessage(message), tipKey: stepKey });
          return false;
        }

        return true;
      };

      return [
        isUseTransfer(position?.pool.token0) ? transferToken0 : approveToken0,
        depositToken0,
        isUseTransfer(position?.pool.token1) ? transferToken1 : approveToken1,
        depositToken1,
        _increaseLiquidity,
      ];
    },
    [principal],
  );
}

export interface InitialAddLiquidityStepsArgs {
  position: Position;
}

function useInitialAddLiquiditySteps() {
  const { t } = useTranslation();
  const stepContentManage = useStepContentManager();

  const handleReclaim = useReclaimCallback();

  return useCallback((key: string, { position }: InitialAddLiquidityStepsArgs) => {
    const content = getIncreaseLiquiditySteps({
      position,
      handleReclaim,
    });

    stepContentManage(String(key), {
      content,
      title: t("swap.add.liquidity.details"),
    });
  }, []);
}

export interface IncreaseLiquidityCallProps {
  position: Position;
  positionId: string;
  poolId: string;
  openExternalTip: OpenExternalTip;
  token0Balance: BigNumber;
  token1Balance: BigNumber;
  token0SubAccountBalance: BigNumber;
  token1SubAccountBalance: BigNumber;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
}

export function useIncreaseLiquidityCall() {
  const getCalls = useIncreaseLiquidityCalls();
  const formatCall = useStepCalls();
  const initialSteps = useInitialAddLiquiditySteps();

  return useCallback(
    ({
      position,
      positionId,
      poolId,
      openExternalTip,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
    }: IncreaseLiquidityCallProps) => {
      const key = newStepKey();
      const calls = getCalls({
        position,
        positionId,
        poolId,
        stepKey: key,
        openExternalTip,
        token0Balance,
        token1Balance,
        token0SubAccountBalance,
        token1SubAccountBalance,
        unusedBalance,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialSteps(key, { position });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialSteps],
  );
}
