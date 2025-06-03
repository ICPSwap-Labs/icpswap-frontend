import { TradeType } from "@icpswap/constants";
import { Null, ResultStatus, TOKEN_STANDARD } from "@icpswap/types";
import { Trade, Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useSlippageManager } from "store/swap/cache/hooks";
import { useSwapFinalMetadataManager, useUpdateSwapOutAmount } from "store/swap/hooks";
import { slippageToPercent } from "constants/index";
import { depositAndSwap, depositFromAndSwap } from "@icpswap/hooks";
import { useAccountPrincipal, useAccountPrincipalString } from "store/auth/hooks";
import {
  useSwapApprove,
  useSwapTransfer,
  getTokenActualTransferRawAmount,
  getTokenInsufficient,
  noApproveOrTransferByTokenInsufficient,
} from "hooks/swap/index";
import { StepCallback, useStepCalls, newStepKey } from "hooks/useStepCall";
import { getLocaleMessage } from "i18n/service";
import { MessageTypes, TIP_SUCCESS, useTips } from "hooks/useTips";
import { isUseTransfer } from "utils/token/index";
import { getSwapSteps } from "components/swap/SwapSteps";
import { useStepContentManager } from "store/steps/hooks";
import { OpenExternalTip } from "types/index";
import { isNullArgs, BigNumber, formatTokenAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { useAllowance } from "hooks/token";

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
  const { t } = useTranslation();
  const updateStep = useStepContentManager();

  return useCallback(({ trade, key, retry }: InitialSwapStepsArgs) => {
    if (!trade) return undefined;

    const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
    const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

    const pool = trade.route.pools[0];
    const token0 = pool.token0;
    const token1 = pool.token1;
    const inputToken = token0.address === trade.inputAmount.currency.address ? token0 : token1;
    const outputToken = token0.address === trade.outputAmount.currency.address ? token0 : token1;

    const content = getSwapSteps({
      inputToken,
      outputToken,
      amount0,
      amount1,
      key: key.toString(),
      retry,
    });

    updateStep(String(key), {
      content,
      title: t("swap.details"),
      // description: t("swap.details.descriptions"),
      type: "swap",
    });
  }, []);
}

export interface SwapCallsCallbackArgs {
  trade: Trade<Token, Token, TradeType> | Trade<Token, Token, TradeType>[] | undefined | null;
  stepKey: string | number;
  openExternalTip: OpenExternalTip;
  subAccountBalance: string;
  balance: string;
  unusedBalance: bigint;
  inputAllowance: bigint | Null;
  refresh: () => void;
}

export function useSwapCalls() {
  const principal = useAccountPrincipal();

  const [allowedSlippage] = useSlippageManager("swap");
  const slippageTolerance = slippageToPercent(allowedSlippage);

  const approve = useSwapApprove();
  const transfer = useSwapTransfer();

  const updateSwapOutAmount = useUpdateSwapOutAmount();
  const { callback: swapFinalMetadataCallback } = useSwapFinalMetadataManager();

  const [openTip] = useTips();

  const initialAndUpdateSwapStep = useInitialSwapSteps();

  return useCallback(
    ({
      trade,
      stepKey: _stepKey,
      subAccountBalance,
      unusedBalance,
      balance,
      inputAllowance,
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
            const inputToken = route.tokenPath[0];
            const outputToken = route.tokenPath[1];
            const pool = route.pools[0];
            const poolId = pool.id;

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
              allowance: inputAllowance,
            });

            const transferOrApprove = async () => {
              if (isNullArgs(tokenInsufficient)) return false;
              if (noApproveOrTransferByTokenInsufficient(tokenInsufficient)) return true;

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

            const swap = async () => {
              if (!principal || !actualSwapAmount || !amountOut) return false;

              const { status, message, data } = isUseTransfer(inputToken)
                ? await depositAndSwap(poolId, {
                    zeroForOne: inputToken.address < outputToken.address,
                    amountIn: actualSwapAmount,
                    amountOutMinimum: amountOut,
                    tokenInFee: BigInt(inputToken.transFee),
                    tokenOutFee: BigInt(outputToken.transFee),
                  })
                : await depositFromAndSwap(poolId, {
                    zeroForOne: inputToken.address < outputToken.address,
                    amountIn: actualSwapAmount,
                    amountOutMinimum: amountOut,
                    tokenInFee: BigInt(inputToken.transFee),
                    tokenOutFee: BigInt(outputToken.transFee),
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
                swapFinalMetadataCallback({
                  outputAmount: formatTokenAmount(outputAmount.toExact(), outputToken.decimals).toString(),
                  inputAmount: actualSwapAmount,
                  inputToken,
                  outputToken,
                });
                initialAndUpdateSwapStep({ trade, key: stepKey });
              }

              const swapOk = status === ResultStatus.OK;

              if (swapOk) {
                refresh();
                openTip("Swap successfully", TIP_SUCCESS);
              }

              return swapOk;
            };

            calls = [transferOrApprove, swap];
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
  unusedBalance: bigint;
  subAccountBalance: string;
  balance: string;
  refresh: () => void;
}

export interface UseConsolidatedSwapProps {
  inputToken: Token | Null;
  poolId: string | Null;
  refresh?: number;
}

export function useSwapCallback({ inputToken, poolId, refresh }: UseConsolidatedSwapProps) {
  const createSwapCalls = useSwapCalls();
  const createSwapCall = useStepCalls();
  const initialSteps = useInitialSwapSteps();
  const principal = useAccountPrincipalString();

  const { result: inputAllowance } = useAllowance({
    canisterId: inputToken?.address,
    spender: poolId,
    owner: principal,
    refresh,
  });

  return useCallback(
    ({ trade, openExternalTip, subAccountBalance, unusedBalance, balance, refresh }: SwapCallbackArgs) => {
      const key = newStepKey();

      const calls = createSwapCalls({
        trade,
        subAccountBalance,
        stepKey: key,
        unusedBalance,
        balance,
        inputAllowance,
        openExternalTip,
        refresh,
      });
      const { call, reset, retry } = createSwapCall(calls, key.toString());

      initialSteps({ trade, key, retry });

      return { call, reset, retry, key };
    },
    [createSwapCalls, createSwapCall, initialSteps, inputAllowance],
  );
}
