import { formatDollarAmount, formatAmount, enumToString, shorten, BigNumber, nonNullArgs } from "@icpswap/utils";
import type { InfoTransactionResponse } from "@icpswap/types";
import dayjs from "dayjs";
import { Copy } from "react-feather";

import { useMemo } from "react";
import { BoxProps, useTheme } from "../Mui";
import { SwapTransactionPriceTip } from "../SwapTransactionPriceTip";
import { TableRow, BodyCell } from "../Table";
import { Link } from "../Link";

function OverflowTokenSymbolBodyCell({ symbol }: { symbol: string }) {
  return (
    <BodyCell
      sx={{
        display: "block",
        maxWidth: "90px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {symbol}
    </BodyCell>
  );
}

export function ActionTypeFormat(transaction: InfoTransactionResponse) {
  const type = enumToString(transaction.actionType);

  switch (type) {
    case "Swap":
      return (
        <BodyCell>
          Swap&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;for&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );

    case "IncreaseLiquidity":
    case "AddLiquidity":
    case "Mint":
      return (
        <BodyCell>
          Add&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;and&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );
    case "DecreaseLiquidity":
      return (
        <BodyCell>
          Remove&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;and&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );
    case "Claim":
      return (
        <BodyCell>
          Collect&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;and&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );

    default:
      return null;
  }
}

interface TransactionRowProps {
  transaction: InfoTransactionResponse;
  wrapperSx?: BoxProps["sx"];
  className?: BoxProps["className"];
  onCopy?: (address: string) => void;
}

export function TransactionRow({ transaction, className, onCopy }: TransactionRowProps) {
  const theme = useTheme();

  const amountUSD = useMemo(() => {
    return nonNullArgs(transaction.token0AmountIn)
      ? new BigNumber(transaction.token0AmountIn).multipliedBy(transaction.token0Price).toString()
      : new BigNumber(transaction.token1AmountIn).multipliedBy(transaction.token1Price).toString();
  }, [transaction]);

  return (
    <TableRow className={className} borderBottom={`1px solid ${theme.palette.border.level1}`}>
      <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

      <BodyCell>{formatDollarAmount(amountUSD)}</BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        {formatAmount(
          nonNullArgs(transaction.token0AmountIn) ? transaction.token0AmountIn : transaction.token0AmountOut,
        )}
        <SwapTransactionPriceTip
          symbol={transaction.token0Symbol}
          price={transaction.token0Price}
          symbolSx={{
            "@media(max-width: 640px)": {
              fontSize: "14px",
            },
          }}
        />
      </BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        {formatAmount(
          nonNullArgs(transaction.token1AmountIn) ? transaction.token1AmountIn : transaction.token1AmountOut,
        )}
        <SwapTransactionPriceTip
          symbol={transaction.token1Symbol}
          price={transaction.token1Price}
          symbolSx={{
            "@media(max-width: 640px)": {
              fontSize: "14px",
            },
          }}
        />
      </BodyCell>

      <BodyCell>
        <BodyCell sx={{ alignItems: "center", gap: "0 4px" }} color="primary.main">
          <Link link={`https://www.icexplorer.io/address/details/${transaction.toPrincipalId}`} color="primary">
            {shorten(transaction.toPrincipalId, 6)}
          </Link>

          <Copy size={12} color="#ffffff" onClick={() => onCopy(transaction.toPrincipalId)} />
        </BodyCell>
      </BodyCell>

      <BodyCell>{dayjs(Number(transaction.txTime)).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
    </TableRow>
  );
}
