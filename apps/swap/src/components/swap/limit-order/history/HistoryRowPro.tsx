import type { Pool } from "@icpswap/swap-sdk";
import type { LimitTransaction, Null } from "@icpswap/types";
import { BodyCell, Flex, TableRow } from "@icpswap/ui";
import { BigNumber, formatAmount, formatTokenPrice } from "@icpswap/utils";
import { LoadingRow, TokenImage } from "components/index";
import { useTheme } from "components/Mui";
import { SyncAltIcon } from "components/MuiIcon";
import dayjs from "dayjs";
import { useLimitHistory } from "hooks/swap/limit-order/useLimitHistory";
import { useState } from "react";

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
}: HistoryRowProProps) {
  const theme = useTheme();
  const [invertPrice, setInvertPrice] = useState(false);
  const { limitPrice, inputChangeAmount, outputChangeAmount, inputToken, outputToken, inputAmount } = useLimitHistory({
    transaction,
  });

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
          <BodyCell
            sx={{
              flexDirection: "column",
              gap: "6px 0",
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Flex gap="0 6px">
              <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
              <BodyCell>
                {formatAmount(outputChangeAmount)} {outputToken?.symbol}
              </BodyCell>
            </Flex>
            <Flex gap="0 6px">
              <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
              <BodyCell>
                {formatAmount(inputChangeAmount)} {inputToken?.symbol}
              </BodyCell>
            </Flex>
          </BodyCell>

          <BodyCell
            sx={{ justifyContent: "flex-end", alignItems: "center", gap: "0 4px" }}
            onClick={() => setInvertPrice(!invertPrice)}
          >
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
                color: "#ffffff",
              }}
            />
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
    </>
  );
}
