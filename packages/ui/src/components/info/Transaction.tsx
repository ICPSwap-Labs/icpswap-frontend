import { formatDollarAmount, formatAmount, enumToString, shorten } from "@icpswap/utils";
import type { PoolStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
import { Copy } from "react-feather";

import { BoxProps, useTheme } from "../Mui";
import { SwapTransactionPriceTip } from "../SwapTransactionPriceTip";
import { TableRow, BodyCell } from "../Table";
import { Link } from "../Link";

export function ActionTypeFormat(transaction: PoolStorageTransaction) {
  const type = enumToString(transaction.action);

  let swapDesc = "";

  switch (type) {
    case "swap":
      swapDesc = `Swap ${transaction.token0Symbol} for ${transaction.token1Symbol}`;
      break;
    case "increaseLiquidity":
    case "addLiquidity":
    case "mint":
      swapDesc = `Add ${transaction.token0Symbol} and ${transaction.token1Symbol}`;
      break;
    case "decreaseLiquidity":
      swapDesc = `Remove ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    case "claim":
      swapDesc = `Collect ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    default:
      break;
  }

  return swapDesc;
}

interface TransactionRowProps {
  transaction: PoolStorageTransaction;
  wrapperSx?: BoxProps["sx"];
  className?: BoxProps["className"];
  onCopy?: (address: string) => void;
}

export function TransactionRow({ transaction, className, onCopy }: TransactionRowProps) {
  const theme = useTheme();

  return (
    <TableRow className={className} borderBottom={`1px solid ${theme.palette.border.level1}`}>
      <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

      <BodyCell>{formatDollarAmount(transaction.amountUSD)}</BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        {formatAmount(transaction.token0ChangeAmount)}
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
        {formatAmount(transaction.token1ChangeAmount)}
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
          <Link link={`http://icexplorer.io/address/detail/${transaction.recipient}`} color="primary">
            {shorten(transaction.recipient, 6)}
          </Link>

          <Copy size={12} color="#ffffff" onClick={() => onCopy(transaction.recipient)} />
        </BodyCell>
      </BodyCell>

      <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
    </TableRow>
  );
}
