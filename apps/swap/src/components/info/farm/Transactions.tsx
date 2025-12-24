import { useState } from "react";
import { pageArgsFormat, enumToString, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { AddressFormat } from "components/index";
import dayjs from "dayjs";
import { useV3FarmStakeRecords } from "@icpswap/hooks";
import { type StakingFarmStakeTransaction } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { useToken } from "hooks/index";
import { Header, HeaderCell, BodyCell, TableRow, NoData, Pagination, ImageLoading } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { Box, makeStyles } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
    },
  };
});

function PoolItem({
  transactions,
  rewardTokenId,
}: {
  rewardTokenId: string | undefined;
  transactions: StakingFarmStakeTransaction;
}) {
  const classes = useStyles();
  const [, token] = useToken(rewardTokenId);

  const isStaking = enumToString(transactions.transType) === "stake";

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      <BodyCell>{upperFirst(enumToString(transactions.transType))}</BodyCell>
      <AddressFormat
        address={isStaking ? transactions.from.toString() : transactions.to.toString()}
        sx={{ fontSize: "16px" }}
      />
      <BodyCell sx={{ maxWidth: "200px", wordBreak: "break-word" }}>
        {isStaking
          ? ""
          : `${
              token
                ? `${toSignificantWithGroupSeparator(
                    parseTokenAmount(transactions.amount, token?.decimals).toString(),
                    6,
                  )} ${token.symbol}`
                : "--"
            }`}
      </BodyCell>
    </TableRow>
  );
}

interface FarmTransactionsProps {
  id: string | undefined;
  rewardTokenId: string | undefined;
}

export function FarmTransactions({ id, rewardTokenId }: FarmTransactionsProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useV3FarmStakeRecords(id, offset, pagination.pageSize);
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ width: "100%", minWidth: "1200px" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.time")}</HeaderCell>
          <HeaderCell>{t("common.type")}</HeaderCell>
          <HeaderCell>{t("common.address")}</HeaderCell>
          <HeaderCell>{t("common.reward.amount")}</HeaderCell>
        </Header>

        <Box>
          {list
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((transactions, index) => (
              <PoolItem key={index} transactions={transactions} rewardTokenId={rewardTokenId} />
            ))}
        </Box>
      </Box>
      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ImageLoading loading={loading || !id} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination length={Number(totalElements)} page={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </Box>
  );
}
