import { Flex } from "@icpswap/ui";

export interface TransactionsEntryProps {
  onClick: () => void;
}

export function TransactionsEntry({ onClick }: TransactionsEntryProps) {
  return (
    <Flex
      className="swap-toolbar-control"
      onClick={onClick}
      sx={{
        width: "36px",
        height: "36px",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid var(--color-base-300)",
        background: "transparent",
      }}
      justify="center"
    >
      <img width="16px" height="16px" src="/images/swap/transactions.svg" alt="" />
    </Flex>
  );
}
