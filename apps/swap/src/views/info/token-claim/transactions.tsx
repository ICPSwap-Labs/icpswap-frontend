import { useState } from "react";
import { Box, makeStyles } from "components/Mui";
import { useParams } from "react-router-dom";
import { Breadcrumbs, Copy, InfoWrapper } from "components/index";
import { useClaimEventTransactions } from "@icpswap/hooks";
import { type ClaimTransaction } from "@icpswap/types";
import { getClaimEventState } from "utils/info/token-claim";
import { Header, HeaderCell, TableRow, BodyCell, NoData, MainCard, Pagination, LoadingRow } from "@icpswap/ui";
import { shorten, timestampFormat, pageArgsFormat, parseTokenAmount, isPrincipalUser } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      padding: "16px",
      alignItems: "center",
      minWidth: "1152px",
    },
  };
});

function ClaimEventTransaction({ ele }: { ele: ClaimTransaction }) {
  const classes = useStyles();
  const state = getClaimEventState(ele);
  const address = isPrincipalUser(ele.claimUser) ? ele.claimUser.principal.toString() : ele.claimUser.address;

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>
        <Copy content={address}>
          <BodyCell color="primary.main">{shorten(address, 12)}</BodyCell>
        </Copy>
      </BodyCell>
      <BodyCell>
        {parseTokenAmount(ele.claimAmount, ele.tokenDecimals).toFormat()} {ele.tokenSymbol}
      </BodyCell>
      <BodyCell>{ele.claimTime[0] ? timestampFormat(ele.claimTime[0]) : "--"}</BodyCell>
      <BodyCell>{state}</BodyCell>
    </TableRow>
  );
}

export default function TokenClaimTransactions() {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useClaimEventTransactions(id, undefined, offset, pagination.pageSize);

  const handlePageChange = (page: number) => {
    setPagination({
      pageNum: page,
      pageSize: 10,
    });
  };

  const totalElements = Number(result?.totalElements ?? 0);

  return (
    <InfoWrapper>
      <Breadcrumbs prevLabel={t("claim.event.records")} currentLabel={t("common.details")} prevLink="/info-claim" />

      <Box mt="20px">
        <MainCard>
          <Box sx={{ overflow: "auto" }}>
            <Header className={classes.wrapper}>
              <HeaderCell>{t("common.address")}</HeaderCell>
              <HeaderCell>{t("common.token")}</HeaderCell>
              <HeaderCell>{t("claim.time")}</HeaderCell>
              <HeaderCell>{t("common.state")}</HeaderCell>
            </Header>

            {result?.content?.map((ele, index) => <ClaimEventTransaction key={index} ele={ele} />)}

            {result?.content?.length === 0 && !loading ? <NoData /> : null}

            {loading ? (
              <Box sx={{ padding: "16px" }}>
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </LoadingRow>
              </Box>
            ) : null}
          </Box>

          {totalElements > 0 ? (
            <Pagination length={totalElements} page={pagination.pageNum} onPageChange={handlePageChange} />
          ) : null}
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
