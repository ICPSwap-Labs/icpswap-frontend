import { formatDollarAmount, formatAmount, enumToString, shorten, BigNumber } from "@icpswap/utils";
import { type InfoTransactionResponse, API_SWAP_TRANSACTIONS_TYPES } from "@icpswap/types";
import dayjs from "dayjs";
import { Copy } from "react-feather";

import { useMemo } from "react";
import { BoxProps, useTheme } from "../Mui";
import { SwapTransactionPriceTip } from "../SwapTransactionPriceTip";
import { TableRow, BodyCell } from "../Table";
import { Link } from "../Link";
import { ValueLabel } from "./ValueLabel";

const DOUBLE_TX_VALUE_TYPES: string[] = [
  API_SWAP_TRANSACTIONS_TYPES.ADD,
  API_SWAP_TRANSACTIONS_TYPES.INCREASE,
  API_SWAP_TRANSACTIONS_TYPES.DECREASE,
  API_SWAP_TRANSACTIONS_TYPES.MINT,
  API_SWAP_TRANSACTIONS_TYPES.COLLECT,
];

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
    case API_SWAP_TRANSACTIONS_TYPES.SWAP:
      return (
        <BodyCell>
          Swap&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;for&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );

    case API_SWAP_TRANSACTIONS_TYPES.INCREASE:
    case API_SWAP_TRANSACTIONS_TYPES.ADD:
    case API_SWAP_TRANSACTIONS_TYPES.MINT:
      return (
        <BodyCell>
          Add&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;and&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );
    case API_SWAP_TRANSACTIONS_TYPES.DECREASE:
      return (
        <BodyCell>
          Remove&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token0Symbol} />
          &nbsp;and&nbsp;
          <OverflowTokenSymbolBodyCell symbol={transaction.token1Symbol} />
        </BodyCell>
      );
    case API_SWAP_TRANSACTIONS_TYPES.COLLECT:
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

  const token0Amount = useMemo(() => {
    return new BigNumber(transaction.token0AmountIn).isEqualTo(0)
      ? transaction.token0AmountOut
      : transaction.token0AmountIn;
  }, [transaction]);

  const token1Amount = useMemo(() => {
    return new BigNumber(transaction.token1AmountIn).isEqualTo(0)
      ? transaction.token1AmountOut
      : transaction.token1AmountIn;
  }, [transaction]);

  const account = useMemo(() => {
    if (transaction.fromPrincipalId === transaction.poolId) return transaction.toPrincipalId;
    return transaction.fromPrincipalId;
  }, [transaction]);

  const txValue = useMemo(() => {
    if (DOUBLE_TX_VALUE_TYPES.includes(transaction.actionType)) {
      return new BigNumber(transaction.token0TxValue).plus(transaction.token1TxValue).toString();
    }

    return transaction.token0TxValue;
  }, [transaction]);

  return (
    <TableRow className={className} borderBottom={`1px solid ${theme.palette.border.level1}`}>
      <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

      <BodyCell sx={{ gap: "0 8px", alignItems: "center" }}>
        {formatDollarAmount(txValue)}
        <ValueLabel value={txValue} />
      </BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        {formatAmount(token0Amount)}
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
        {formatAmount(token1Amount)}
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
          <Link link={`https://www.icexplorer.io/address/details/${account}`} color="primary">
            {shorten(account, 6)}
          </Link>

          <Copy size={12} color="#ffffff" onClick={() => onCopy(account)} />
        </BodyCell>
      </BodyCell>

      <BodyCell>{dayjs(Number(transaction.txTime)).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
    </TableRow>
  );
}
