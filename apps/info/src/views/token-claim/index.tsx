import { useState } from "react";
import { Typography, Box } from "@mui/material";
import {
  MainCard,
  MainContainer,
  NoData,
  Pagination,
  PaginationType,
  LoadingRow,
  TextButton,
} from "ui-component/index";
import { makeStyles } from "@mui/styles";
import { pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Trans } from "@lingui/macro";
import { useClaimEvents } from "@icpswap/hooks";
import type { ClaimEventInfo } from "@icpswap/types";
import { getEventState } from "utils/token-claim";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "240px 200px 150px repeat(5, 1fr) 80px 80px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

export interface ClaimEventItemProps {
  ele: ClaimEventInfo;
}

function ClaimEventItem({ ele }: ClaimEventItemProps) {
  const classes = useStyles();
  const state = getEventState(ele);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{ele.claimEventName}</BodyCell>
      <BodyCell>{ele.claimCanisterId}</BodyCell>
      <BodyCell>{ele.tokenSymbol}</BodyCell>
      <BodyCell>{new BigNumber(ele.totalUserAmount.toString()).toFormat()}</BodyCell>
      <BodyCell>{parseTokenAmount(ele.totalTokenAmount, ele.tokenDecimals).toFormat()}</BodyCell>
      <BodyCell>{new BigNumber(ele.claimedUserAmount.toString()).toFormat()}</BodyCell>
      <BodyCell>{parseTokenAmount(ele.claimedTokenAmount, ele.tokenDecimals).toFormat()}</BodyCell>
      <BodyCell>
        {parseTokenAmount((ele.totalTokenAmount - ele.claimedTokenAmount).toString(), ele.tokenDecimals).toFormat()}
      </BodyCell>
      <BodyCell>{state}</BodyCell>
      <BodyCell>
        <TextButton to={`/token-claim/transactions/${ele.claimEventId}`}>
          <Trans>Details</Trans>
        </TextButton>
      </BodyCell>
    </TableRow>
  );
}

export default function TokenClaim() {
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useClaimEvents(offset, pagination.pageSize);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const totalElements = Number(result?.totalElements ?? 0);

  return (
    <MainContainer>
      <MainCard>
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h3" component="div">
            <Trans>Claim event records</Trans>
          </Typography>
        </Box>

        <Box mt="20px" sx={{ overflow: "auto", width: "100%" }}>
          <Box sx={{ minWidth: "1368px" }}>
            <Header className={classes.wrapper}>
              <HeaderCell>
                <Trans>Claim Event</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Canister ID</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Token</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Token addresses</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Total Tokens</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Claimed addresses</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Claimed Tokens</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>Balance</Trans>
              </HeaderCell>
              <HeaderCell>
                <Trans>State</Trans>
              </HeaderCell>
              <HeaderCell>&nbsp;</HeaderCell>
            </Header>

            {result?.content?.map((ele, index) => <ClaimEventItem key={index} ele={ele} />)}

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

            {result?.content?.length === 0 && !loading ? <NoData /> : null}

            {totalElements > 0 ? (
              <Pagination total={totalElements} num={pagination.pageNum} onPageChange={handlePageChange} />
            ) : null}
          </Box>
        </Box>
      </MainCard>
    </MainContainer>
  );
}
