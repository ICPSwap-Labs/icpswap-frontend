import { Pool } from "@icpswap/swap-sdk";
import { TableRow, BodyCell } from "@icpswap/ui";
import { LoadingRow, TokenImage } from "components/index";
import { useState } from "react";
import { useTheme } from "components/Mui";
import { BigNumber, formatAmount, formatTokenPrice } from "@icpswap/utils";
import dayjs from "dayjs";
import { LimitTransaction, Null } from "@icpswap/types";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { useLimitHistory } from "hooks/swap/limit-order/useLimitHistory";

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
  const { limitPrice, outputChangeAmount, inputToken, outputToken, inputAmount } = useLimitHistory({ transaction });

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
