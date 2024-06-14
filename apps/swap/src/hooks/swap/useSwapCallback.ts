import { TradeType } from "@icpswap/constants";
import { ResultStatus } from "@icpswap/types";
import BigNumber from "bignumber.js";
import { Trade, Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useSlippageManager } from "store/swap/cache/hooks";
import { useUpdateSwapOutAmount, getSwapOutAmount } from "store/swap/hooks";
import { slippageToPercent } from "constants/index";
import { swap } from "hooks/swap/v3Calls";
import { useAccountPrincipal } from "store/auth/hooks";
import { useSwapApprove, useSwapDeposit, useSwapTransfer, useSwapWithdraw } from "hooks/swap/index";
import { StepCallback, useStepCalls, newStepKey, useCloseAllSteps } from "hooks/useStepCall";
import { getActorIdentity } from "components/Identity";
import { getLocaleMessage } from "locales/services";
import { useErrorTip } from "hooks/useTips";
import { t } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { getSwapStep } from "components/swap/SwapSteps";
import { useStepContentManager } from "store/steps/hooks";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useHistory } from "react-router-dom";

export enum SwapCallbackState {
  INVALID = "INVALID",
  LOADING = "LOADING",
  VALID = "VALID",
}

export interface InitialSwapStepsArgs {
  trade: Trade<Token, Token, TradeType> | undefined | null;
  key: number | string;
  retry?: () => Promise<boolean>;
}

export function useInitialSwapSteps() {
  const updateStep = useStepContentManager();
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();

  const handleReclaim = () => {
    history.push("/swap/reclaim");
    closeAllSteps();
  };

  return useCallback(({ trade, key, retry }: InitialSwapStepsArgs) => {
    if (!trade) return undefined;

    const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
    const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

    const content = getSwapStep({
      inputCurrency: trade.inputAmount.currency,
      outputCurrency: trade.outputAmount.currency,
      amount0,
      amount1,
      key: key.toString(),
      retry,
      handleReclaim,
    });

    updateStep(String(key), {
      content,
      title: t`Swap Details`,
    });
  }, []);
}

export interface SwapCallsCallbackArgs {
  trade: Trade<Token, Token, TradeType> | Trade<Token, Token, TradeType>[] | undefined | null;
  stepKey: string | number;
  openExternalTip: OpenExternalTip;
  subAccountTokenBalance: BigNumber;
  swapInTokenUnusedBalance: bigint;
}

export function useSwapCalls() {
  const principal = useAccountPrincipal();

  const [allowedSlippage] = useSlippageManager("swap");
  const slippageTolerance = slippageToPercent(allowedSlippage);

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();
  const withdraw = useSwapWithdraw();

  const updateSwapOutAmount = useUpdateSwapOutAmount();

  const [openErrorTip] = useErrorTip();

  const initialAndUpdateSwapStep = useInitialSwapSteps();

  return useCallback(
    ({
      trade,
      stepKey: _stepKey,
      swapInTokenUnusedBalance,
      subAccountTokenBalance,
      openExternalTip,
    }: SwapCallsCallbackArgs) => {
      if (!trade || !principal) return undefined;

      const stepKey = _stepKey.toString();

      let trades: Trade<Token, Token, TradeType>[] = [];

      if (!Array.isArray(trade)) {
        trades = [trade];
      }

      let calls: undefined | StepCallback[];

      for (const trade of trades) {
        for (const { route, inputAmount, outputAmount } of trade.swaps) {
          const actualSwapAmount = trade.maximumAmountIn(slippageTolerance, inputAmount).quotient.toString();
          const amountOut = trade.minimumAmountOut(slippageTolerance, outputAmount).quotient.toString();

          const singleHop = route.pools.length === 1;

          if (singleHop) {
            const tokenIn = route.tokenPath[0];
            const tokenOut = route.tokenPath[1];
            const poolId = route.pools[0].id;

            updateSwapOutAmount(stepKey, undefined);

            // Amount that user input
            const userInputAmount = actualSwapAmount
              ? isUseTransfer(tokenIn)
                ? new BigNumber(actualSwapAmount).plus(tokenIn.transFee).toString()
                : actualSwapAmount
              : undefined;

            const step0 = async () => {
              if (!userInputAmount) return false;

              // Skip transfer if unused token balance is greater than or equal to actual swap amount
              if (swapInTokenUnusedBalance >= BigInt(actualSwapAmount)) {
                return true;
              }

              if (isUseTransfer(tokenIn)) {
                // Skip transfer if unDeposit token balance is greater than or equal to user input amount
                if (!subAccountTokenBalance.isLessThan(userInputAmount)) {
                  return true;
                }

                return await transfer(route.input.wrapped, userInputAmount, poolId);
              }

              return await approve(route.input.wrapped, userInputAmount, poolId);
            };

            const step1 = async () => {
              if (!userInputAmount) return false;

              // Skip transfer if unused token balance is greater than or equal to actual swap amount
              if (swapInTokenUnusedBalance >= BigInt(actualSwapAmount)) {
                return true;
              }

              return await deposit(route.input.wrapped, userInputAmount, poolId, ({ message }: ExternalTipArgs) => {
                openExternalTip({ message, tipKey: stepKey, poolId });
              });
            };

            const step2 = async () => {
              if (!principal || !actualSwapAmount || !amountOut) return false;

              const identity = await getActorIdentity();

              const { status, message, data } = await swap(poolId, identity, {
                zeroForOne: tokenIn.address < tokenOut.address,
                amountIn: actualSwapAmount,
                amountOutMinimum: amountOut,
              });

              if (status === ResultStatus.ERROR) {
                if (openExternalTip) {
                  openExternalTip({
                    message: getLocaleMessage(message),
                    tipKey: stepKey,
                    poolId,
                  });
                } else {
                  openErrorTip(getLocaleMessage(message));
                }
              } else {
                updateSwapOutAmount(stepKey, data);
                initialAndUpdateSwapStep({ trade, key: stepKey });
              }

              return status === ResultStatus.OK;
            };

            const step3 = async () => {
              const swapOutAmount = getSwapOutAmount(stepKey);

              if (swapOutAmount !== undefined) {
                // skip with error
                if (new BigNumber(swapOutAmount.toString()).minus(outputAmount.currency.transFee).isLessThan(0)) {
                  return "skip";
                }

                return await withdraw(
                  outputAmount.currency.wrapped,
                  poolId,
                  swapOutAmount.toString(),
                  ({ message }: ExternalTipArgs) => {
                    openExternalTip({ message, tipKey: stepKey, tokenId: outputAmount.currency.address });
                  },
                );
              }
              return false;
            };

            calls = [step0, step1, step2, step3];
          }
        }
      }

      return calls;
    },
    [principal, slippageTolerance, allowedSlippage],
  );
}

export interface SwapCallbackArgs {
  trade: Trade<Token, Token, TradeType> | undefined | null;
  openExternalTip: OpenExternalTip;
  subAccountTokenBalance: BigNumber;
  swapInTokenUnusedBalance: bigint;
}

export function useSwapCallback() {
  const createSwapCalls = useSwapCalls();
  const createSwapCall = useStepCalls();
  const initialSteps = useInitialSwapSteps();

  return useCallback(
    ({ trade, openExternalTip, swapInTokenUnusedBalance, subAccountTokenBalance }: SwapCallbackArgs) => {
      const key = newStepKey();

      const calls = createSwapCalls({
        trade,
        swapInTokenUnusedBalance,
        stepKey: key,
        subAccountTokenBalance,
        openExternalTip,
      });
      const { call, reset, retry } = createSwapCall(calls, key.toString());

      initialSteps({ trade, key, retry });

      return { call, reset, retry, key };
    },
    [createSwapCalls, createSwapCall, initialSteps],
  );
}
