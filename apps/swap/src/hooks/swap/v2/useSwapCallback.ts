import { CurrencyAmount, BigintIsh, Trade, Token } from "@icpswap/swap-sdk";
import { StatusResult } from "@icpswap/types";
import { TradeType } from "@icpswap/constants";
import { useMemo } from "react";
import { useSlippageManager, useUserTransactionsDeadline } from "store/swapv2/cache/hooks";
import { useAccount } from "store/global/hooks";
import { slippageToPercent } from "constants/index";
import { toHex } from "utils/swap/index";
import { exactInputSingle, exactOutputSingle } from "hooks/swap/v2/useSwapCalls";
import { useApprove } from "hooks/token/useApprove";
import { useErrorTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { Principal } from "@dfinity/principal";
import { Identity } from "types/global";
import { t } from "@lingui/macro";

export enum SwapCallbackState {
  INVALID = "INVALID",
  LOADING = "LOADING",
  VALID = "VALID",
}

export function useSwapArguments(
  trade: Trade<Token, Token, TradeType> | Trade<Token, Token, TradeType>[] | undefined | null,
  allowedSlippage: BigintIsh,
  recipientPrincipal?: Principal,
): {
  callData: ((identity: Identity) => Promise<StatusResult<bigint> | undefined>) | null | undefined;
  value: string;
} {
  const principal = useAccountPrincipal();
  const recipient = !recipientPrincipal ? principal : recipientPrincipal;
  const deadline = useUserTransactionsDeadline();
  const slippageTolerance = slippageToPercent(allowedSlippage);
  const [openErrorTip] = useErrorTip();
  const approveCall = useApprove();

  return useMemo(() => {
    if (!trade || !recipient || !principal || !deadline) return { callData: undefined, value: "" };

    let trades: Trade<Token, Token, TradeType>[] = [];

    if (!Array.isArray(trade)) {
      trades = [trade];
    }

    const sampleTrade = trades[0];

    let callData: ((identity: Identity) => Promise<StatusResult<bigint> | undefined>) | null | undefined = null;

    const ZERO_IN = CurrencyAmount.fromRawAmount(trades[0].inputAmount.currency, 0);

    const ZERO_OUT = CurrencyAmount.fromRawAmount(trades[0].outputAmount.currency, 0);

    const totalAmountOut = trades.reduce((sum, trade) => sum.add(trade.minimumAmountOut(slippageTolerance)), ZERO_OUT);

    // flag for whether a refund needs to happen
    // const mustRefund =
    //   sampleTrade.inputAmount.currency.isNative &&
    //   sampleTrade.tradeType === TradeType.EXACT_OUTPUT;
    const inputIsNative = sampleTrade.inputAmount.currency.isNative;
    // flags for whether funds should be send first to the router
    // const outputIsNative = sampleTrade.outputAmount.currency.isNative;
    // const routerMustCustody = outputIsNative || !!options.fee;

    // const totalValue = inputIsNative
    //   ? trades.reduce(
    //       (sum, trade) => sum.add(trade.maximumAmountIn(slippageTolerance)),
    //       ZERO_IN
    //     )
    //   : ZERO_IN;

    const totalValue = ZERO_IN;

    for (const trade of trades) {
      for (const { route, inputAmount, outputAmount } of trade.swaps) {
        const amountIn = trade.maximumAmountIn(slippageTolerance, inputAmount).quotient.toString();
        const amountOut = trade.minimumAmountOut(slippageTolerance, outputAmount).quotient.toString();

        const singleHop = route.pools.length === 1;

        if (singleHop) {
          const tokenIn = route.tokenPath[0].address;
          const tokenOut = route.tokenPath[1].address;
          const { fee } = route.pools[0];

          const poolId = route.pools[0].id;

          if (trade.tradeType === TradeType.EXACT_INPUT) {
            callData = async (identity: Identity) => {
              const { status: approveStatus } = await approveCall({
                canisterId: tokenIn,
                spender: poolId,
                value: amountIn,
                account: principal,
              });

              if (approveStatus === "err") {
                openErrorTip(t`Failed to approve`);
                return;
              }

              return exactInputSingle(
                identity,
                `${tokenIn}_${tokenOut}_${fee}`,
                recipient,
                deadline,
                amountIn,
                amountOut,
              );
            };
          } else {
            callData = async (identity: Identity) => {
              const { status: approveStatus } = await approveCall({
                canisterId: tokenIn,
                spender: poolId,
                value: amountIn,
                account: principal,
              });

              if (approveStatus === "err") {
                openErrorTip(t`Failed to approve`);
                return;
              }

              return exactOutputSingle(
                identity,
                `${tokenIn}_${tokenOut}_${fee}`,
                recipient,
                deadline,
                amountOut,
                amountIn,
              );
            };
          }
        } else {
          // const path = encodeRouteToPath(
          //   route,
          //   trade.tradeType === TradeType.EXACT_OUTPUT
          // );
          const path = "";

          if (trade.tradeType === TradeType.EXACT_INPUT) {
            const exactInputParams = {
              path,
              recipient,
              deadline,
              amountIn,
              amountOutMinimum: amountOut,
            };
          } else {
            const exactOutputParams = {
              path,
              recipient,
              deadline,
              amountOut,
              amountInMaximum: amountIn,
            };
          }
        }
      }
    }

    return {
      callData,
      value: toHex(totalValue.quotient),
    };
  }, [trade, recipient, deadline, principal]);
}

export function useSwapCallback(
  trade: Trade<Token, Token, TradeType> | Trade<Token, Token, TradeType>[] | undefined | null,
  recipientAddress?: Principal,
) {
  const account = useAccount();
  const recipient = !recipientAddress ? account : recipientAddress;
  const deadline = useUserTransactionsDeadline();
  const [slippageTolerance] = useSlippageManager("swap");

  const { callData } = useSwapArguments(trade, slippageTolerance, recipientAddress);

  return useMemo(() => {
    if (!trade || !account) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: "Missing dependencies",
      };
    }

    if (!callData) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: "Callback error",
      };
    }

    if (!recipient) {
      if (recipientAddress !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: "Invalid recipient",
        };
      }
      return {
        state: SwapCallbackState.LOADING,
        callback: null,
        error: null,
      };
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(identity: Identity) {
        return callData(identity);
      },
    };
  }, [trade, recipientAddress, deadline, slippageTolerance]);
}
