import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, makeStyles } from "components/Mui";
import { Wrapper, Breadcrumbs, MainCard, Pagination, PaginationType, ImageLoading, NoData } from "components/index";
import { useUserClaimEventTransactions } from "@icpswap/hooks";
import { ClaimTransaction } from "@icpswap/types";
import { useToken } from "hooks/index";
import { timestampFormat, pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { HeaderCell, Header, BodyCell, TableRow } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  };
});

export function TokenClaimTransaction({ transaction }: { transaction: ClaimTransaction }) {
  const classes = useStyles();

  const [, token] = useToken(transaction.tokenCid);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{transaction.claimTime[0] ? timestampFormat(transaction.claimTime[0]) : "--"}</BodyCell>
      <BodyCell>{transaction.claimEventName}</BodyCell>
      <BodyCell>
        {parseTokenAmount(transaction.claimAmount, token?.decimals).toFormat()} {token?.symbol}
      </BodyCell>
    </TableRow>
  );
}

export default function TokenClaimTransactions() {
  const classes = useStyles();
  const { t } = useTranslation();

  const { id: user } = useParams<{ id: string }>();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result: userClaimTransaction, loading } = useUserClaimEventTransactions(
    user,
    undefined,
    1,
    offset,
    pagination.pageSize,
  );

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <Wrapper>
      <Breadcrumbs prevLink="/token-claim" prevLabel={t`Claim your tokens`} currentLabel={t`Your records`} />

      <Box mt="20px">
        <MainCard>
          <Box sx={{ position: "relative", minHeight: "300px" }}>
            <Header className={classes.wrapper}>
              <HeaderCell field="time">{t("common.time")}</HeaderCell>
              <HeaderCell field="name">{t("claim.event.name")}</HeaderCell>
              <HeaderCell field="amount">{t("common.amount")}</HeaderCell>
            </Header>

            {(userClaimTransaction?.content ?? []).map((transaction, index) => (
              <TokenClaimTransaction key={`${String(transaction.claimEventId)}_${index}`} transaction={transaction} />
            ))}

            {!loading && (userClaimTransaction?.content ?? []).length === 0 ? (
              <NoData tip={t("claim.transactions.empty")} />
            ) : null}

            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  top: "0",
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <ImageLoading mask loading={loading} />
              </Box>
            ) : null}

            <Box mt="20px">
              {(userClaimTransaction?.content.length ?? 0) > 0 ? (
                <Pagination count={Number(userClaimTransaction?.totalElements ?? 0)} onPageChange={handlePageChange} />
              ) : null}
            </Box>
          </Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
