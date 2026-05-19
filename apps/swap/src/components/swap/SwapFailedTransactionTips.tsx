import { useSwapFailedTransactions } from "hooks/swap/useSwapFailedTransactions";
import type { Null } from "@icpswap/types";
import { Checkbox, Flex } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Box, Typography } from "components/Mui";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

    const { symbol, transactions } = useSwapFailedTransactions(poolId);

    useEffect(() => {
      updateNeedCheckOrNot(transactions.length > 0);
    }, [transactions, updateNeedCheckOrNot]);

    const handleCheck = useCallback(
      (check: boolean) => {
        setChecked(check);
        onCheckChange(check);
      },
      [onCheckChange],
    );

    // Reset checked if poolId changed.
    useEffect(() => {
      setChecked(false);
      onCheckChange(false);
      // oxlint-disable-next-line
    }, [poolId]);

    return transactions && transactions.length > 0 && nonUndefinedOrNull(symbol) ? (
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
            {t("swap.token.out.of.cycles", { symbol })}
          </Typography>
        </Flex>
      </Box>
    ) : null;
  },
);
