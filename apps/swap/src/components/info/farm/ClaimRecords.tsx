import { useState } from "react";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import dayjs from "dayjs";
import { ImageLoading, AddressFormat } from "components/index";
import { useV3FarmDistributeRecords } from "@icpswap/hooks";
import type { StakingFarmDistributeTransaction } from "@icpswap/types";
import { useToken } from "hooks/index";
import { Header, HeaderCell, BodyCell, Pagination, NoData, TableRow } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { makeStyles, Box } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
    },
  };
});

interface PoolItemProps {
  rewardTokenId: string | undefined;
  transactions: StakingFarmDistributeTransaction;
}

function PoolItem({ transactions, rewardTokenId }: PoolItemProps) {
  const classes = useStyles();
  const [, rewardToken] = useToken(rewardTokenId);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      <BodyCell>{`${parseTokenAmount(transactions.rewardGained, rewardToken?.decimals).toFormat()} ${
        rewardToken?.symbol ?? "--"
      }`}</BodyCell>
      <AddressFormat address={transactions.owner.toString()} sx={{ fontSize: "16px" }} />
    </TableRow>
  );
}

interface FarmClaimTransactionsProps {
  id: string | undefined;
  rewardTokenId: string | undefined;
}

export function FarmClaimTransactions({ id, rewardTokenId }: FarmClaimTransactionsProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useV3FarmDistributeRecords(id, offset, pagination.pageSize);
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

        {list
          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
          .map((transactions, index) => (
            <PoolItem key={index} transactions={transactions} rewardTokenId={rewardTokenId} />
          ))}
      </Box>

      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ImageLoading loading={loading} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination length={Number(totalElements)} onPageChange={handlePageChange} page={pagination.pageNum} />
      ) : null}
    </Box>
  );
}
