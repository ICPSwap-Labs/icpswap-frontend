import { TradeType } from "@icpswap/constants";
import { ResultStatus, TOKEN_STANDARD } from "@icpswap/types";
import { Trade, Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useSlippageManager, useSwapKeepTokenInPools } from "store/swap/cache/hooks";
import { useUpdateSwapOutAmount, getSwapOutAmount } from "store/swap/hooks";
import { slippageToPercent } from "constants/index";
import { swap } from "hooks/swap/v3Calls";
import { useAccountPrincipal } from "store/auth/hooks";
import {
  useSwapApprove,
  useSwapDeposit,
  useSwapTransfer,
  useSwapWithdraw,
  getTokenActualTransferRawAmount,
  getTokenActualDepositRawAmount,
  getTokenInsufficient,
} from "hooks/swap/index";
import { StepCallback, useStepCalls, newStepKey, useCloseAllSteps } from "hooks/useStepCall";
import { getLocaleMessage } from "i18n/service";
import { MessageTypes, useTips } from "hooks/useTips";
import { isUseTransfer } from "utils/token/index";
import { getSwapStep } from "components/swap/SwapSteps";
import { useStepContentManager } from "store/steps/hooks";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useHistory } from "react-router-dom";
import { isNullArgs, parseTokenAmount, sleep, toSignificantWithGroupSeparator, BigNumber } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

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
  const keepTokenInPools = useSwapKeepTokenInPools();
  const { t } = useTranslation();

  const handleReclaim = () => {
    history.push("/swap/withdraw");
    closeAllSteps();
  };

  return useCallback(
    ({ trade, key, retry }: InitialSwapStepsArgs) => {
      if (!trade) return undefined;

      const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
      const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

      const inputToken = trade.inputAmount.currency;
      const outputToken = trade.outputAmount.currency;

      const content = getSwapStep({
        inputToken,
        outputToken,
        amount0,
        amount1,
        key: key.toString(),
        retry,
        handleReclaim,
        keepTokenInPools,
      });

      updateStep(String(key), {
        content,
        title: t("swap.details"),
        description: t`If you have sufficient balance in the swap pool, you may be able to swap directly without needing to deposit.`,
      });
    },
    [keepTokenInPools],
  );
}

export interface SwapCallsCallbackArgs {
  trade: Trade<Token, Token, TradeType> | Trade<Token, Token, TradeType>[] | undefined | null;
  stepKey: string | number;
  openExternalTip: OpenExternalTip;
  subAccountBalance: BigNumber;
  balance: BigNumber;
  unusedBalance: bigint;
  refresh: () => void;
}

export function useSwapCalls() {
  const principal = useAccountPrincipal();

  const [allowedSlippage] = useSlippageManager("swap");
  const slippageTolerance = slippageToPercent(allowedSlippage);
  const keepTokenInPools = useSwapKeepTokenInPools();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();
  const withdraw = useSwapWithdraw();

  const updateSwapOutAmount = useUpdateSwapOutAmount();

  const [openTip] = useTips();

  const initialAndUpdateSwapStep = useInitialSwapSteps();

  return useCallback(
    ({
      trade,
      stepKey: _stepKey,
      subAccountBalance,
      unusedBalance,
      balance,
      openExternalTip,
      refresh,
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
            const pool = route.pools[0];
            const poolId = pool.id;
            const token0 = pool.token0;
            const token1 = pool.token1;
            const inputToken = token0.address === tokenIn.address ? token0 : token1;

            updateSwapOutAmount(stepKey, undefined);

            // Amount that user input
            // Now the swap amount is the amount that user input
            const userInputAmount = actualSwapAmount;

            const tokenInsufficient = getTokenInsufficient({
              token: inputToken,
              subAccountBalance,
              unusedBalance,
              balance,
              formatTokenAmount: userInputAmount,
            });

            const step0 = async () => {
              if (isNullArgs(tokenInsufficient)) return false;

              if (tokenInsufficient === "NO_TRANSFER_APPROVE" || tokenInsufficient === "NEED_DEPOSIT") return true;

              if (isUseTransfer(inputToken)) {
                const needTransferAmount = new BigNumber(userInputAmount)
                  .minus(unusedBalance.toString())
                  .minus(subAccountBalance)
                  .toString();

                return await transfer(
                  inputToken,
                  getTokenActualTransferRawAmount(needTransferAmount, inputToken),
                  poolId,
                );
              }

              return await approve({
                token: inputToken,
                amount: userInputAmount,
                poolId,
                standard: inputToken.standard as TOKEN_STANDARD,
              });
            };

            const step1 = async () => {
              if (isNullArgs(tokenInsufficient)) return false;

              if (tokenInsufficient === "NO_TRANSFER_APPROVE") return true;

              const needDepositAmount = new BigNumber(userInputAmount).minus(unusedBalance.toString()).toString();

              return await deposit({
                token: inputToken,
                amount: getTokenActualDepositRawAmount(needDepositAmount, inputToken),
                poolId,
                openExternalTip: ({ message }: ExternalTipArgs) => {
                  openExternalTip({ message, tipKey: stepKey, poolId });
                },
                standard: inputToken.standard as TOKEN_STANDARD,
              });
            };

            const withdraw_step = async () => {
              const swapOutAmount = getSwapOutAmount(stepKey);

              if (swapOutAmount !== undefined) {
                // skip with error
                if (new BigNumber(swapOutAmount.toString()).minus(outputAmount.currency.transFee).isLessThan(0)) {
                  return "skip";
                }

                openTip(
                  `${toSignificantWithGroupSeparator(
                    parseTokenAmount(swapOutAmount, outputAmount.currency.decimals).toString(),
                  )} ${outputAmount.currency.symbol} withdrawal submitted`,
                  MessageTypes.success,
                );

                const withdrawResult = await withdraw(
                  outputAmount.currency.wrapped,
                  poolId,
                  swapOutAmount.toString(),
                  ({ message }: ExternalTipArgs) => {
                    openExternalTip({ message, tipKey: stepKey, tokenId: outputAmount.currency.address });
                  },
                );

                refresh();

                return withdrawResult;
              }

              return false;
            };

            const step2 = async () => {
              if (!principal || !actualSwapAmount || !amountOut) return false;

              const { status, message, data } = await swap(poolId, {
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
                  openTip(getLocaleMessage(message), MessageTypes.error);
                }
              } else {
                updateSwapOutAmount(stepKey, data);
                initialAndUpdateSwapStep({ trade, key: stepKey });
              }

              const swapOk = status === ResultStatus.OK;

              if (swapOk && !keepTokenInPools) {
                withdraw_step();
              }

              if (swapOk && keepTokenInPools) {
                refresh();
              }

              return swapOk;
            };

            const step3 = async () => {
              await sleep(2000);
              return true;
            };

            if (keepTokenInPools) {
              calls = [step0, step1, step2];
            } else {
              calls = [step0, step1, step2, step3];
            }
          }
        }
      }

      return calls;
    },
    [principal, slippageTolerance, allowedSlippage, keepTokenInPools],
  );
}

export interface SwapCallbackArgs {
  trade: Trade<Token, Token, TradeType> | undefined | null;
  openExternalTip: OpenExternalTip;
  unusedBalance: bigint;
  subAccountBalance: BigNumber;
  balance: BigNumber;
  refresh: () => void;
}

export function useSwapCallback() {
  const createSwapCalls = useSwapCalls();
  const createSwapCall = useStepCalls();
  const initialSteps = useInitialSwapSteps();

  return useCallback(
    ({ trade, openExternalTip, subAccountBalance, unusedBalance, balance, refresh }: SwapCallbackArgs) => {
      const key = newStepKey();

      const calls = createSwapCalls({
        trade,
        subAccountBalance,
        stepKey: key,
        unusedBalance,
        balance,
        openExternalTip,
        refresh,
      });
      const { call, reset, retry } = createSwapCall(calls, key.toString());

      initialSteps({ trade, key, retry });

      return { call, reset, retry, key };
    },
    [createSwapCalls, createSwapCall, initialSteps],
  );
}
