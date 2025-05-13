import { useState, useCallback, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, formatAmount, isNullArgs, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex, TextButton } from "@icpswap/ui";
import { LimitTransaction } from "@icpswap/types";
import { TokenImage } from "components/index";
import dayjs from "dayjs";
import { useToken } from "hooks/index";
import { useUserUnusedBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { WithdrawTokens } from "components/swap/limit-order/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";

export interface HistoryRowProps {
  transaction: LimitTransaction;
  wrapperClasses?: string;
}

export function HistoryRow({ transaction, wrapperClasses }: HistoryRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const [showWithdrawTokens, setShowWithdrawTokens] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);

  const { result: unusedBalance } = useUserUnusedBalance(transaction.poolId, principal);

  const { inputTokenId, outputTokenId, inputAmount, outputChangeAmount, inputChangeAmount } = useMemo(() => {
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
    if (!outputToken) return undefined;
    return new BigNumber(outputChangeAmount).dividedBy(inputAmount).toFixed(outputToken.decimals);
  }, [outputChangeAmount, outputToken, inputAmount]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  const disableWithdraw = useMemo(() => {
    if (isNullArgs(unusedBalance) || isNullArgs(inputToken) || isNullArgs(outputToken)) return true;

    const token0 = inputToken.sortsBefore(outputToken) ? inputToken : outputToken;
    const token1 = inputToken.sortsBefore(outputToken) ? outputToken : inputToken;

    return (
      !new BigNumber(unusedBalance.balance0.toString()).isGreaterThan(token0.transFee) &&
      !new BigNumber(unusedBalance.balance1.toString()).isGreaterThan(token1.transFee)
    );
  }, [unusedBalance, inputToken, outputToken]);

  return (
    <>
      <Box
        className={wrapperClasses}
        sx={{
          background: theme.palette.background.level3,
          padding: "20px 16px",
          borderRadius: "12px",
          width: "100%",
          "&:hover": {
            background: theme.palette.background.level4,
          },
        }}
      >
        <Flex>
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {dayjs(Number(transaction.timestamp * BigInt(1000))).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Flex>

        <Flex gap="0 6px">
          <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {formatAmount(inputAmount)} {inputToken?.symbol}
          </Typography>
        </Flex>

        <Flex gap="6px 0" vertical align="flex-start">
          <Flex gap="0 6px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
              {formatAmount(outputChangeAmount)} {outputToken?.symbol}
            </Typography>
          </Flex>
          <Flex gap="0 6px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
              {formatAmount(inputChangeAmount)} {inputToken?.symbol}
            </Typography>
          </Flex>
        </Flex>

        <Flex gap="0 2px" justify="flex-end">
          <Typography
            sx={{ color: "text.primary", cursor: "pointer", display: "flex", gap: "0 2px", alignItems: "center" }}
            component="div"
            onClick={handleInvert}
          >
            {limitPrice ? (
              <>
                {invertPrice
                  ? `1 ${outputToken?.symbol} = ${toSignificantWithGroupSeparator(
                      new BigNumber(1).dividedBy(limitPrice).toString(),
                    )} ${inputToken?.symbol}`
                  : `1 ${inputToken?.symbol} = ${limitPrice} ${outputToken?.symbol}`}
                <SyncAltIcon sx={{ fontSize: "1rem" }} />
              </>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex justify="flex-end">
          <TextButton onClick={() => setShowWithdrawTokens(true)} disabled={disableWithdraw}>
            {t("common.withdraw")}
          </TextButton>
        </Flex>
      </Box>

      {showWithdrawTokens ? (
        <WithdrawTokens
          open={showWithdrawTokens}
          onClose={() => setShowWithdrawTokens(false)}
          transaction={transaction}
        />
      ) : null}
    </>
  );
}
