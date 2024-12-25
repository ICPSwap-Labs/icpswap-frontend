import { Pool } from "@icpswap/swap-sdk";
import { TableRow, BodyCell, TextButton } from "@icpswap/ui";
import { LoadingRow, TokenImage } from "components/index";
import { Trans } from "@lingui/macro";
import { useState, useMemo } from "react";
import { Typography, useTheme } from "components/Mui";
import { toSignificantWithGroupSeparator, BigNumber, isNullArgs } from "@icpswap/utils";
import dayjs from "dayjs";
import { LimitTransaction, Null } from "@icpswap/types";
import { useToken } from "hooks/index";
import { WithdrawTokens } from "components/swap/limit-order/WithdrawTokens";

export interface LimitHistoryRowProps {
  limitTransaction: LimitTransaction;
  pool: Pool | Null;
  wrapperClassName?: string;
  noBorder?: boolean;
  unusedBalance: { balance0: bigint; balance1: bigint } | Null;
}

export function LimitHistoryRow({
  limitTransaction: transaction,
  pool,
  wrapperClassName,
  noBorder = false,
  unusedBalance,
}: LimitHistoryRowProps) {
  const theme = useTheme();

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
          <BodyCell sx={{ gap: "0 6px" }}>
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(inputAmount)} {inputToken?.symbol}
            </Typography>
          </BodyCell>

          {/* You receive */}
          <BodyCell sx={{ gap: "0 6px" }}>
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(outputChangeAmount)} {outputToken?.symbol}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <Typography sx={{ color: "text.primary" }}>
              {limitPrice ? `1 ${inputToken?.symbol} = ${limitPrice} ${outputToken?.symbol}` : "--"}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <TextButton onClick={() => setShowWithdrawTokens(true)} disabled={disableWithdraw}>
              <Trans>Withdraw</Trans>
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
