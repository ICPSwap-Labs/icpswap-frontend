import { useTheme } from "components/Mui";
import { PositionTransaction } from "@icpswap/types";
import { TableRow, BodyCell, Flex, TextButton } from "@icpswap/ui";
import { Copy, TokenImage } from "components/index";
import { useToken } from "hooks/index";
import dayjs from "dayjs";
import { shorten } from "@icpswap/utils";
import { useMemo } from "react";
import { Trans } from "@lingui/macro";

export interface PositionTransactionsRowProps {
  transaction: PositionTransaction;
  wrapperClassName?: string;
}

export function PositionTransactionsRow({ transaction, wrapperClassName }: PositionTransactionsRowProps) {
  const theme = useTheme();

  const positionId = useMemo(() => {
    if ("transferPosition" in transaction.action) {
      return transaction.action.transferPosition;
    }

    return null;
  }, [transaction]);

  const [, token0] = useToken(transaction.token0Id);
  const [, token1] = useToken(transaction.token1Id);

  return (
    <>
      <TableRow className={wrapperClassName} borderBottom={`1px solid ${theme.palette.border.level1}`}>
        <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD hh:mm:ss")}</BodyCell>

        <BodyCell sx={{ gap: "0 8px", alignItems: "center" }}>
          <Flex>
            <TokenImage tokenId={transaction.token0Id} logo={token0?.logo} size="24px" />
            <TokenImage tokenId={transaction.token1Id} logo={token1?.logo} size="24px" />
          </Flex>
          {transaction.token0Symbol}/{transaction.token1Symbol}
        </BodyCell>

        <BodyCell sx={{ justifyContent: "flex-end" }}>{positionId ? positionId.toString() : "--"}</BodyCell>

        <BodyCell sx={{ justifyContent: "flex-end" }}>
          <Copy content={transaction.from}>{shorten(transaction.from)}</Copy>
        </BodyCell>

        <BodyCell sx={{ justifyContent: "flex-end" }}>
          <Copy content={transaction.to}>{shorten(transaction.to)}</Copy>
        </BodyCell>

        <BodyCell sx={{ justifyContent: "flex-end" }}>
          <TextButton
            to={`/liquidity/position/${positionId}/${transaction.poolId}`}
            sx={{
              fontSize: "16px",
              "@media(max-width: 640px)": {
                fontSize: "14px",
              },
            }}
          >
            <Trans>Details</Trans>
          </TextButton>
        </BodyCell>
      </TableRow>
    </>
  );
}
