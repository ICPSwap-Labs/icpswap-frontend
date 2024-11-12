import { formatDollarAmount, formatAmount, enumToString, shorten } from "@icpswap/utils";
import type { PoolStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";

import { Copy } from "../Copy";
import { BoxProps } from "../Mui";
import { SwapTransactionPriceTip } from "../SwapTransactionPriceTip";
import { TableRow, BodyCell } from "../Table";

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
}

export function TransactionRow({ transaction, className }: TransactionRowProps) {
  return (
    <TableRow className={className}>
      <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

      <BodyCell>{formatDollarAmount(transaction.amountUSD, 3)}</BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        {formatAmount(transaction.token0ChangeAmount, 4)}
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
        {formatAmount(transaction.token1ChangeAmount, 4)}
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
        <Copy content={transaction.recipient}>
          <BodyCell color="primary.main">{shorten(transaction.recipient, 8)}</BodyCell>
        </Copy>
      </BodyCell>

      <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
    </TableRow>
  );
}
