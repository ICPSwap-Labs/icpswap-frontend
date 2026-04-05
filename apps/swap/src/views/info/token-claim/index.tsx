import { useClaimEvents } from "@icpswap/hooks";
import type { ClaimEventInfo } from "@icpswap/types";
import {
  BodyCell,
  Header,
  HeaderCell,
  LoadingRow,
  MainCard,
  NoData,
  Pagination,
  TableRow,
  TextButton,
} from "@icpswap/ui";
import { BigNumber, pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { InfoWrapper } from "components/index";
import { Box, Typography } from "components/Mui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getEventState } from "utils/info/token-claim";

const wrapperSx = {
  display: "grid",
  gridTemplateColumns: "240px 200px 150px repeat(5, 1fr) 80px 80px",
  padding: "16px",
  alignItems: "center",
  minWidth: "1152px",
};

export interface ClaimEventItemProps {
  ele: ClaimEventInfo;
}

function ClaimEventItem({ ele }: ClaimEventItemProps) {
  const { t } = useTranslation();
  const state = getEventState(ele);

  return (
    <TableRow sx={wrapperSx}>
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
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { data, isLoading } = useClaimEvents(offset, pagination.pageSize);

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  const totalElements = Number(data?.totalElements ?? 0);

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
            <Header sx={wrapperSx}>
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

            {data?.content?.map((ele, index) => (
              <ClaimEventItem key={index} ele={ele} />
            ))}

            {isLoading ? (
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

            {data?.content?.length === 0 && !isLoading ? <NoData /> : null}
          </Box>
        </Box>

        {totalElements > 0 ? (
          <Pagination length={totalElements} page={pagination.pageNum} onPageChange={handlePageChange} />
        ) : null}
      </MainCard>
    </InfoWrapper>
  );
}
