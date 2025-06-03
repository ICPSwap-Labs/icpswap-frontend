import { tickToPrice } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { LimitTransaction } from "@icpswap/types";
import { useToken } from "hooks/index";

export interface UseLimitHistoryProps {
  transaction: LimitTransaction;
}

export function useLimitHistory({ transaction }: UseLimitHistoryProps) {
  const { inputTokenId, outputTokenId, inputAmount, inputChangeAmount, outputChangeAmount } = useMemo(() => {
    const inputTokenId = new BigNumber(transaction.token0InAmount).isEqualTo(0)
      ? transaction.token1Id
      : transaction.token0Id;

    const outputTokenId = inputTokenId === transaction.token1Id ? transaction.token0Id : transaction.token1Id;
    const inputAmount = inputTokenId === transaction.token1Id ? transaction.token1InAmount : transaction.token0InAmount;
    const outputChangeAmount =
      inputTokenId === transaction.token1Id ? transaction.token0ChangeAmount : transaction.token1ChangeAmount;
    const inputChangeAmount =
      inputTokenId === transaction.token1Id ? transaction.token1ChangeAmount : transaction.token0ChangeAmount;

    return {
      inputTokenId,
      outputTokenId,
      inputAmount,
      outputChangeAmount,
      inputChangeAmount,
    };
  }, [transaction]);

  const [, inputToken] = useToken(inputTokenId);
  const [, outputToken] = useToken(outputTokenId);

  const limitPrice = useMemo(() => {
    if (!outputToken || !inputToken) return undefined;
    const price = tickToPrice(inputToken, outputToken, Number(transaction.tick));

    return price.toSignificant();
  }, [inputToken, outputToken, transaction]);

  const receiveAmount = useMemo(() => {
    if (isNullArgs(inputAmount) || isNullArgs(limitPrice)) return undefined;
    return new BigNumber(inputAmount).multipliedBy(limitPrice).toString();
  }, [inputAmount, limitPrice]);

  return useMemo(
    () => ({
      limitPrice,
      receiveAmount,
      inputToken,
      outputToken,
      inputAmount,
      outputChangeAmount,
      inputChangeAmount,
    }),
    [limitPrice, receiveAmount, inputAmount, inputToken, outputToken, inputChangeAmount, outputChangeAmount],
  );
}
