import { useStakingPoolClaimTransactions } from "@icpswap/hooks";
import type { StakingPoolTransaction } from "@icpswap/types";
import { BodyCell, Header, HeaderCell, ImageLoading, NoData, Pagination, TableRow } from "@icpswap/ui";
import { pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { AddressFormat } from "components/index";
import { Box, makeStyles } from "components/Mui";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr  1fr 1fr",
    },
  };
});

function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  const classes = useStyles();

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      <BodyCell>{`${parseTokenAmount(transactions.amount, Number(transactions.rewardTokenDecimals)).toFormat()} ${
        transactions.rewardTokenSymbol
      }`}</BodyCell>
      <AddressFormat address={transactions.to.toString()} sx={{ fontSize: "16px" }} />
    </TableRow>
  );
}

export function StakeClaimTransactions({ id }: { id: string | undefined }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { data: result, isLoading: loading } = useStakingPoolClaimTransactions(
    id,
    undefined,
    offset,
    pagination.pageSize,
  );
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ width: "100%", minWidth: "1200px" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.time")}</HeaderCell>
          <HeaderCell>{t("common.token.amount")}</HeaderCell>
          <HeaderCell>{t("common.address")}</HeaderCell>
        </Header>

        <>
          {list
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((transactions, index) => (
              <PoolItem key={index} transactions={transactions} />
            ))}
        </>
        {list.length === 0 && !loading && !!id ? <NoData /> : null}
        {loading || !id ? <ImageLoading loading={loading || !id} /> : null}
        {Number(totalElements) > 0 ? (
          <Pagination length={Number(totalElements)} onPageChange={handlePageChange} page={pagination.pageNum} />
        ) : null}
      </Box>
    </Box>
  );
}
