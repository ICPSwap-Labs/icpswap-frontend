import { useState } from "react";
import { Typography, Box, makeStyles } from "components/Mui";
import { InfoWrapper } from "components/index";
import { pageArgsFormat, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { useClaimEvents } from "@icpswap/hooks";
import type { ClaimEventInfo } from "@icpswap/types";
import { getEventState } from "utils/info/token-claim";
import {
  MainCard,
  NoData,
  LoadingRow,
  TextButton,
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  Pagination,
} from "@icpswap/ui";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "240px 200px 150px repeat(5, 1fr) 80px 80px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1152px",
    },
  };
});

export interface ClaimEventItemProps {
  ele: ClaimEventInfo;
}

function ClaimEventItem({ ele }: ClaimEventItemProps) {
  const { t } = useTranslation();
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
        <TextButton to={`/info-claim/transactions/${ele.claimEventId}`}>{t("common.details")}</TextButton>
      </BodyCell>
    </TableRow>
  );
}

export default function TokenClaim() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useClaimEvents(offset, pagination.pageSize);

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  const totalElements = Number(result?.totalElements ?? 0);

  return (
    <InfoWrapper>
      <MainCard>
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h3" component="div">
            {t("claim.event.records")}
          </Typography>
        </Box>

        <Box mt="20px" sx={{ overflow: "auto", width: "100%" }}>
          <Box>
            <Header className={classes.wrapper}>
              <HeaderCell>{t("claim.event")}</HeaderCell>
              <HeaderCell>{t("common.canister.id")}</HeaderCell>
              <HeaderCell>{t("common.token")}</HeaderCell>
              <HeaderCell>{t("claim.token.addresses")}</HeaderCell>
              <HeaderCell>{t("claim.total.tokens")}</HeaderCell>
              <HeaderCell>{t("claim.claimed.addresses")}</HeaderCell>
              <HeaderCell>{t("claim.claimed.tokens")}</HeaderCell>
              <HeaderCell>{t("common.balance")}</HeaderCell>
              <HeaderCell>{t("common.state")}</HeaderCell>
              <HeaderCell>&nbsp;</HeaderCell>
            </Header>

            {result?.content?.map((ele, index) => <ClaimEventItem key={index} ele={ele} />)}

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

            {result?.content?.length === 0 && !loading ? <NoData /> : null}
          </Box>
        </Box>

        {totalElements > 0 ? (
          <Pagination length={totalElements} page={pagination.pageNum} onPageChange={handlePageChange} />
        ) : null}
      </MainCard>
    </InfoWrapper>
  );
}
