import { useCallback, useMemo, useState } from "react";
import { Box, Typography, useTheme, CircularProgress } from "components/Mui";
import { Modal, TextButton, Flex } from "@icpswap/ui";
import { LimitTransaction } from "@icpswap/types";
import { CanisterIcon } from "assets/icons/swap/CanisterIcon";
import { useUserUnusedBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { useRefreshTriggerManager, useToken, useTips, MessageTypes } from "hooks/index";
import { BigNumber, formatAmount, isUndefinedOrNull, parseTokenAmount, sleep } from "@icpswap/utils";
import { useSwapWithdraw } from "hooks/swap/index";
import { Trans, useTranslation } from "react-i18next";

export interface WithdrawTokensProps {
  open: boolean;
  onClose: () => void;
  transaction: LimitTransaction;
}

export function WithdrawTokens({ open, transaction, onClose }: WithdrawTokensProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("LIMIT-WITHDRAW-TOKENS");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const [, inputToken] = useToken(transaction.token0Id);
  const [, outputToken] = useToken(transaction.token1Id);
  const { result: unusedBalance } = useUserUnusedBalance(transaction.poolId, principal, refreshTrigger);
  const [openTip] = useTips();

  const isSorted = inputToken && outputToken ? inputToken.sortsBefore(outputToken) : undefined;

  const withdraw = useSwapWithdraw();

  const { inputBalance, outputBalance } = useMemo(() => {
    if (!unusedBalance) return {};

    return {
      inputBalance: isSorted ? unusedBalance.balance0 : unusedBalance.balance1,
      outputBalance: isSorted ? unusedBalance.balance1 : unusedBalance.balance0,
    };
  }, [unusedBalance, isSorted]);

  const handleWithdraw = useCallback(
    async (val: "input" | "output") => {
      if (
        isUndefinedOrNull(inputBalance) ||
        isUndefinedOrNull(outputBalance) ||
        isUndefinedOrNull(inputToken) ||
        isUndefinedOrNull(outputToken)
      )
        return;

      if (val === "input") {
        setLoading((prevState) => ({ ...prevState, input: true }));
        withdraw(inputToken, transaction.poolId, inputBalance.toString()).then((result) => {
          if (result) {
            setRefreshTrigger();
          }
        });
        openTip(t("withdrawal.submitted"), MessageTypes.success);
        await sleep(2000);
        setLoading((prevState) => ({ ...prevState, input: false }));
      } else {
        setLoading((prevState) => ({ ...prevState, output: true }));
        withdraw(outputToken, transaction.poolId, outputBalance.toString()).then((result) => {
          if (result) {
            setRefreshTrigger();
          }
        });
        openTip(t("withdrawal.submitted"), MessageTypes.success);
        await sleep(2000);
        setLoading((prevState) => ({ ...prevState, output: false }));
      }
    },
    [withdraw, inputToken, outputToken, inputBalance, outputBalance, transaction, isSorted],
  );

  return (
    <Modal open={open} title={t("limit.withdraw.tokens")} onClose={onClose} background="level1">
      <Box sx={{ padding: "14px 16px", borderRadius: "12px", background: theme.palette.background.level2 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: "20px" }}>
          <Trans
            components={{
              highlight: (
                <TextButton sx={{ fontSize: "12px" }} link="https://iloveics.gitbook.io/icpswap/products/limit-order">
                  <Trans>click here.</Trans>
                </TextButton>
              ),
            }}
            i18nKey="limit.filled.descriptions"
          />
        </Typography>
      </Box>
      <Box mt="24px">
        <Flex justify="space-between">
          <Flex gap="0 4px">
            <CanisterIcon />
            <Typography>{transaction.token0Symbol}:</Typography>
            <Typography fontWeight={500}>
              {unusedBalance
                ? formatAmount(parseTokenAmount(unusedBalance.balance0, transaction.token0Decimals).toString())
                : "--"}
            </Typography>
          </Flex>

          <Flex gap="0 4px">
            <TextButton
              onClick={() => handleWithdraw("input")}
              disabled={
                isUndefinedOrNull(inputBalance) ||
                isUndefinedOrNull(isSorted) ||
                inputBalance === BigInt(0) ||
                loading.input ||
                (inputToken && !new BigNumber(inputBalance.toString()).isGreaterThan(inputToken.transFee))
              }
            >
              {t("common.withdraw")}
            </TextButton>
            {loading.input ? <CircularProgress size={12} sx={{ color: "#ffffff" }} /> : null}
          </Flex>
        </Flex>

        <Flex justify="space-between" sx={{ margin: "32px 0 0 0" }}>
          <Flex gap="0 4px">
            <CanisterIcon />
            <Typography>{transaction.token1Symbol}:</Typography>
            <Typography fontWeight={500}>
              {unusedBalance
                ? formatAmount(parseTokenAmount(unusedBalance.balance1, transaction.token1Decimals).toString())
                : "--"}
            </Typography>
          </Flex>

          <Flex gap="0 4px">
            <TextButton
              onClick={() => handleWithdraw("output")}
              disabled={
                isUndefinedOrNull(outputBalance) ||
                isUndefinedOrNull(isSorted) ||
                outputBalance === BigInt(0) ||
                loading.output ||
                (outputToken && !new BigNumber(outputBalance.toString()).isGreaterThan(outputToken.transFee))
              }
            >
              {t("common.withdraw")}
            </TextButton>
            {loading.output ? <CircularProgress size={12} sx={{ color: "#ffffff" }} /> : null}
          </Flex>
        </Flex>
      </Box>
    </Modal>
  );
}
