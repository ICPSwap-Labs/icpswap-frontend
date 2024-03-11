import { useMemo, useCallback } from "react";
import {
  parseTokenAmount,
  formatTokenAmount,
  resultFormat,
  availableArgsNull,
  isAvailablePageArgs,
} from "@icpswap/utils";
import type { PaginationResult, NumberType } from "@icpswap/types";
import { Currency } from "@icpswap/swap-sdk";
import { swapPool, swapTicket } from "@icpswap/actor";
import { useCallsData } from "@icpswap/hooks";
import type { Ticket } from "@icpswap/types";
import { v2SwapPool } from "hooks/v2-actor";

export function useActualSwapAmount(
  amount: NumberType | undefined,
  currency: Currency | undefined,
): string | undefined {
  return useMemo(() => {
    if (!amount || !currency) return undefined;

    const typedValue = formatTokenAmount(amount, currency.decimals);
    const fee = currency.transFee;

    if (typedValue.isGreaterThan(currency.transFee)) {
      return parseTokenAmount(typedValue.minus(fee), currency.decimals).toString();
    } else {
      return "0";
    }
  }, [amount, currency]);
}

export function useSwapPoolCycles(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<{ balance: bigint; available: bigint }>(await (await swapPool(canisterId!)).getCycleInfo())
        .data;
    }, [canisterId]),
  );
}

export function useV2SwapPoolCycles(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await v2SwapPool(canisterId!)).cycleBalance()).data;
    }, [canisterId]),
  );
}

export async function getSwapTokenAmountState(canisterId: string) {
  return resultFormat<{
    swapFee0Repurchase: bigint;
    token0Amount: bigint;
    token1Amount: bigint;
    swapFee1Repurchase: bigint;
  }>(await (await swapPool(canisterId!)).getTokenAmountState()).data;
}

export function useSwapTokenAmountState(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapTokenAmountState(canisterId!);
    }, [canisterId]),
  );
}

export function useSwapTickets(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<Ticket>>(
        await (
          await swapTicket()
        ).tickets(availableArgsNull<bigint>(BigInt(offset)), availableArgsNull<bigint>(BigInt(limit))),
      ).data;
    }, [offset, limit]),
  );
}

export * from "./useUserAllPositions";
