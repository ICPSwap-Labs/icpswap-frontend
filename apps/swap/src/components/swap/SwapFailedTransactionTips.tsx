import { useState, useCallback, memo, useEffect } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, Checkbox } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";
import { useSwapFailedTransactions } from "@icpswap/hooks";
import { BigNumber, isUndefinedOrNull, nanosecond2Millisecond, nonUndefinedOrNull } from "@icpswap/utils";
import { swapTransactionActionFormat } from "utils/transaction";

export interface SwapFailedTransactionTipsProps {
  onCheckChange: (checked: boolean) => void;
  ui?: "pro";
  poolId?: string | Null;
  updateNeedCheckOrNot: (checked: boolean) => void;
}

export const SwapFailedTransactionTips = memo(
  ({ onCheckChange, poolId, ui, updateNeedCheckOrNot }: SwapFailedTransactionTipsProps) => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);
    const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
    const [outOfCyclesFailedTransactions, setOutOfCyclesFailedTransaction] = useState<bigint[]>([]);

    const handleCheck = useCallback((check: boolean) => {
      setChecked(check);
      onCheckChange(check);
    }, []);

    const { result: swapFailedTransactions } = useSwapFailedTransactions(poolId);

    useEffect(() => {
      async function call() {
        if (isUndefinedOrNull(swapFailedTransactions) || swapFailedTransactions.length === 0) return undefined;

        const failedFTransactionsWithMessage = await Promise.all(
          swapFailedTransactions.map(async ([index, transaction]) => {
            const { message, tokens } = await swapTransactionActionFormat(transaction.action);
            return {
              index,
              message,
              tokens,
              time: transaction.timestamp,
            };
          }),
        );

        // Only the message includes "is out of cycles" can be trigger the error tips
        // And the time must after 2025/07/20
        const outOfCyclesFailedTransaction = failedFTransactionsWithMessage.filter(({ message, time }) => {
          if (!message) return false;
          return (
            message.includes("out of cycles") &&
            new BigNumber(nanosecond2Millisecond(time)).isGreaterThan(new Date("2025-07-20T08:00:00").getTime())
          );
        });

        if (outOfCyclesFailedTransaction.length === 0) return;

        const failedTransaction = outOfCyclesFailedTransaction[0];
        const tokens = failedTransaction.tokens;
        const tokenSymbol = tokens[0].symbol;
        setTokenSymbol(tokenSymbol);
        setOutOfCyclesFailedTransaction(outOfCyclesFailedTransaction.map(({ index }) => index));
      }

      call();
    }, [swapFailedTransactions]);

    useEffect(() => {
      if (outOfCyclesFailedTransactions && outOfCyclesFailedTransactions.length > 0) {
        updateNeedCheckOrNot(true);
      }
    }, [outOfCyclesFailedTransactions]);

    return outOfCyclesFailedTransactions &&
      outOfCyclesFailedTransactions.length > 0 &&
      nonUndefinedOrNull(tokenSymbol) ? (
      <Box
        sx={{
          padding: ui === "pro" ? "10px" : "16px",
          background: "rgba(211, 98, 91, 0.15)",
          borderRadius: "16px",
        }}
      >
        <Flex gap="0 8px" align="flex-start">
          <Flex>
            <Checkbox checked={checked} onCheckedChange={handleCheck} />
          </Flex>

          <Typography
            style={{
              color: "#D3625B",
              lineHeight: "15px",
              fontSize: "12px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => handleCheck(!checked)}
          >
            {t("swap.token.out.of.cycles", { symbol: tokenSymbol })}
          </Typography>
        </Flex>
      </Box>
    ) : null;
  },
);
