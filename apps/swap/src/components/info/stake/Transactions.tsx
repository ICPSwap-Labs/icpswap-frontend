import { useMemo, useState } from "react";
import { PaginationType, ImageLoading, AddressFormat } from "components/index";
import { Box, makeStyles } from "components/Mui";
import dayjs from "dayjs";
import { useStakingPoolTransactions } from "@icpswap/hooks";
import { parseTokenAmount, enumToString, pageArgsFormat } from "@icpswap/utils";
import { StakingPoolTransaction } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { HeaderCell, BodyCell, Header, TableRow, NoData, Pagination } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 120px 1fr 1fr 1fr",
    },
  };
});

function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  const classes = useStyles();

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
    <TableRow className={classes.wrapper}>
      <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      <BodyCell>{upperFirst(enumToString(transactions.transType))}</BodyCell>
      <AddressFormat address={transactions.from.toString()} sx={{ fontSize: "16px" }} />
      <AddressFormat address={transactions.to.toString()} sx={{ fontSize: "16px" }} />
      <BodyCell>{tokenAmount}</BodyCell>
    </TableRow>
  );
}

interface TransactionsProps {
  id: string | undefined;
}

export function StakeTransactions({ id }: TransactionsProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPoolTransactions(id, undefined, offset, pagination.pageSize);
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ width: "100%", minWidth: "1200px" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.time")}</HeaderCell>
          <HeaderCell>{t("common.type")}</HeaderCell>
          <HeaderCell>{t("common.from")}</HeaderCell>
          <HeaderCell>{t("common.to")}</HeaderCell>
          <HeaderCell>{t("common.amount")}</HeaderCell>
        </Header>

        {list
          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
          .map((transactions, index) => (
            <PoolItem key={index} transactions={transactions} />
          ))}
      </Box>
      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ImageLoading loading={loading || !id} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} onPageChange={handlePageChange} num={pagination.pageNum} />
      ) : null}
    </Box>
  );
}
