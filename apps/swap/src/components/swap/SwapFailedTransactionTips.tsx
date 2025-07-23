import { useState, useCallback, memo, useEffect } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, Checkbox } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";
import { useSwapFailedTransactions } from "@icpswap/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
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

    const handleCheck = useCallback((check: boolean) => {
      setChecked(check);
      onCheckChange(check);
    }, []);

    const { result: swapFailedTransactions } = useSwapFailedTransactions(poolId);

    useEffect(() => {
      async function call() {
        if (isUndefinedOrNull(swapFailedTransactions) || swapFailedTransactions.length === 0) return undefined;

        const failedTransaction = swapFailedTransactions[0]?.[1];
        const { tokens } = await swapTransactionActionFormat(failedTransaction.action);
        const tokenSymbol = tokens[0].symbol;
        setTokenSymbol(tokenSymbol);
      }

      call();
    }, [swapFailedTransactions]);

    useEffect(() => {
      if (swapFailedTransactions && swapFailedTransactions.length > 0) {
        updateNeedCheckOrNot(false);
      }
    }, [swapFailedTransactions]);

    return swapFailedTransactions && swapFailedTransactions.length > 0 && nonUndefinedOrNull(tokenSymbol) ? (
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
