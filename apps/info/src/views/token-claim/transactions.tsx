import { useState } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import {
  MainCard,
  MainContainer,
  NoData,
  Pagination,
  PaginationType,
  Breadcrumbs,
  Copy,
  LoadingRow,
} from "ui-component/index";
import { Trans, t } from "@lingui/macro";
import { useClaimEventTransactions } from "@icpswap/hooks";
import { type ClaimTransaction } from "@icpswap/types";
import { getClaimEventState } from "utils/token-claim";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";
import { shorten, timestampFormat, pageArgsFormat, parseTokenAmount, isPrincipalUser } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
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
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useClaimEventTransactions(id, undefined, offset, pagination.pageSize);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const totalElements = Number(result?.totalElements ?? 0);

  return (
    <MainContainer>
      <Breadcrumbs prevLabel={t`Claim event records`} currentLabel={t`Details`} prevLink="/token-claim" />

      <Box mt="20px">
        <MainCard>
          <Box sx={{ overflow: "auto" }}>
            <Header className={classes.wrapper}>
              <HeaderCell>
                <Trans>Address</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Token</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Claim Time</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>State</Trans>
              </HeaderCell>
            </Header>

            {result?.content?.map((ele, index) => <ClaimEventTransaction key={index} ele={ele} />)}

            {result?.content?.length === 0 && !loading ? <NoData /> : null}

            {loading ? (
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
            ) : null}

            {totalElements > 0 ? (
              <Pagination total={totalElements} num={pagination.pageNum} onPageChange={handlePageChange} />
            ) : null}
          </Box>
        </MainCard>
      </Box>
    </MainContainer>
  );
}
