import { useMemo, useState } from "react";
import { Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { Trans } from "@lingui/macro";
import { PaginationType, ListLoading, AddressFormat } from "components/index";
import dayjs from "dayjs";
import { useStakingPoolTransactions } from "@icpswap/hooks";
import { parseTokenAmount, enumToString, pageArgsFormat } from "@icpswap/utils";
import { StakingPoolTransaction } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { HeaderCell, BodyCell, NoData, Pagination } from "@icpswap/ui";

function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  const tokenType = useMemo(() => {
    if ("stakeToken" in transactions.transTokenType) {
      return "stakeToken";
    }

    return "rewardToken";
  }, [transactions]);

  const tokenAmount = useMemo(() => {
    if (tokenType === "rewardToken") {
      return `${parseTokenAmount(transactions.amount, transactions.rewardTokenDecimals).toFormat()} ${
        transactions.rewardTokenSymbol
      }`;
    }

    return `${parseTokenAmount(transactions.amount, transactions.stakingTokenDecimals).toFormat()} ${
      transactions.stakingTokenSymbol
    }`;
  }, [tokenType]);

  return (
    <TableRow>
      <TableCell>
        <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{upperFirst(enumToString(transactions.transType))}</BodyCell>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.from.toString()} sx={{ fontSize: "16px" }} />
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.to.toString()} sx={{ fontSize: "16px" }} />
      </TableCell>
      <TableCell>
        <BodyCell>{tokenAmount}</BodyCell>
      </TableCell>
    </TableRow>
  );
}

interface TransactionsProps {
  id: string | undefined;
}

export function StakeTransactions({ id }: TransactionsProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPoolTransactions(id, undefined, offset, pagination.pageSize);
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TableContainer className={loading || !id ? "with-loading" : ""}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <HeaderCell>
                <Trans>Time</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Type</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>From</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>To</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Amount</Trans>
              </HeaderCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((transactions, index) => (
              <PoolItem key={index} transactions={transactions} />
            ))}
        </TableBody>
      </Table>
      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ListLoading loading={loading || !id} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} onPageChange={handlePageChange} num={pagination.pageNum} />
      ) : null}
    </TableContainer>
  );
}
