import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";

export interface TransactionsEntryProps {
  onClick: () => void;
}

export function TransactionsEntry({ onClick }: TransactionsEntryProps) {
  const theme = useTheme();

  return (
    <Flex
      onClick={onClick}
      sx={{
        width: "32px",
        height: "32px",
        cursor: "pointer",
        borderRadius: "40px",
        background: theme.palette.background.level2,
      }}
      justify="center"
    >
      <img width="16px" height="16px" src="/images/swap/transactions.svg" alt="" />
    </Flex>
  );
}
