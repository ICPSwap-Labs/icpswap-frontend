import { Pool } from "@icpswap/swap-sdk";
import { TableRow, BodyCell, TextButton } from "@icpswap/ui";
import { LoadingRow, TokenImage } from "components/index";
import { useState, useMemo } from "react";
import { useTheme } from "components/Mui";
import { BigNumber, isNullArgs, formatAmount, formatTokenPrice } from "@icpswap/utils";
import dayjs from "dayjs";
import { LimitTransaction, Null } from "@icpswap/types";
import { useToken } from "hooks/index";
import { WithdrawTokens } from "components/swap/limit-order/WithdrawTokens";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export interface HistoryRowProProps {
  limitTransaction: LimitTransaction;
  pool: Pool | Null;
  wrapperClassName?: string;
  noBorder?: boolean;
  unusedBalance: { balance0: bigint; balance1: bigint } | Null;
}

export function HistoryRowPro({
  limitTransaction: transaction,
  pool,
  wrapperClassName,
  noBorder = false,
  unusedBalance,
}: HistoryRowProProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [invertPrice, setInvertPrice] = useState(false);
  const [showWithdrawTokens, setShowWithdrawTokens] = useState(false);

  const { inputTokenId, outputTokenId, inputAmount, outputChangeAmount } = useMemo(() => {
    const inputTokenId = new BigNumber(transaction.token0InAmount).isEqualTo(0)
      ? transaction.token1Id
      : transaction.token0Id;

    const outputTokenId = inputTokenId === transaction.token1Id ? transaction.token0Id : transaction.token1Id;
    const inputAmount = inputTokenId === transaction.token1Id ? transaction.token1InAmount : transaction.token0InAmount;
    const outputChangeAmount =
      inputTokenId === transaction.token1Id ? transaction.token0ChangeAmount : transaction.token1ChangeAmount;

    return {
      inputTokenId,
      outputTokenId,
      inputAmount,
      outputChangeAmount,
    };
  }, [transaction]);

  const [, inputToken] = useToken(inputTokenId);
  const [, outputToken] = useToken(outputTokenId);

  const limitPrice = useMemo(() => {
    if (!outputToken) return undefined;
    return new BigNumber(outputChangeAmount).dividedBy(inputAmount).toFixed(outputToken.decimals);
  }, [outputChangeAmount, outputToken, inputAmount]);

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
      {pool ? (
        <TableRow
          className={wrapperClassName}
          borderBottom={noBorder ? "none!important" : `1px solid ${theme.palette.border.level1}`}
        >
          <BodyCell>{dayjs(Number(transaction.timestamp * BigInt(1000))).format("YYYY-MM-DD HH:mm")}</BodyCell>

          {/* You pay */}
          <BodyCell sx={{ gap: "0 6px", alignItems: "center" }}>
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <BodyCell>
              {formatAmount(inputAmount)} {inputToken?.symbol}
            </BodyCell>
          </BodyCell>

          {/* You receive */}
          <BodyCell sx={{ gap: "0 6px", alignItems: "center" }}>
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <BodyCell>
              {formatAmount(outputChangeAmount)} {outputToken?.symbol}
            </BodyCell>
          </BodyCell>

          <BodyCell sx={{ display: "inline-block", textAlign: "right" }} onClick={() => setInvertPrice(!invertPrice)}>
            {limitPrice
              ? invertPrice
                ? `1 ${outputToken?.symbol} = ${formatTokenPrice(
                    new BigNumber(1).dividedBy(limitPrice).toString(),
                  )} ${inputToken?.symbol}`
                : `1 ${inputToken?.symbol} = ${formatTokenPrice(limitPrice)} ${outputToken?.symbol}`
              : "--"}
            <SyncAltIcon
              sx={{
                fontSize: "1rem",
                cursor: "pointer",
                color: "#ffffff",
                margin: "0 0 0 4px",
                verticalAlign: "middle",
              }}
            />
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <TextButton onClick={() => setShowWithdrawTokens(true)} disabled={disableWithdraw}>
              {t("common.withdraw")}
            </TextButton>
          </BodyCell>
        </TableRow>
      ) : (
        <TableRow>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </TableRow>
      )}

      <WithdrawTokens
        open={showWithdrawTokens}
        onClose={() => setShowWithdrawTokens(false)}
        transaction={transaction}
      />
    </>
  );
}
