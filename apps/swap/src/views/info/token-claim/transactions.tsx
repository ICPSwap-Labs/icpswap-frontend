import { useClaimEventTransactions } from "@icpswap/hooks";
import type { ClaimTransaction } from "@icpswap/types";
import { BodyCell, Header, HeaderCell, LoadingRow, MainCard, NoData, Pagination, TableRow } from "@icpswap/ui";
import { isPrincipalUser, pageArgsFormat, parseTokenAmount, shorten, timestampFormat } from "@icpswap/utils";
import { Breadcrumbs, Copy, InfoWrapper } from "components/index";
import { Box } from "components/Mui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getClaimEventState } from "utils/info/token-claim";

const wrapperSx = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  padding: "16px",
  alignItems: "center",
  minWidth: "1152px",
};

function ClaimEventTransaction({ ele }: { ele: ClaimTransaction }) {
  const state = getClaimEventState(ele);
  const address = isPrincipalUser(ele.claimUser) ? ele.claimUser.principal.toString() : ele.claimUser.address;

  return (
    <TableRow sx={wrapperSx}>
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
  const { id } = useParams<{ id: string }>();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { data, isLoading } = useClaimEventTransactions(id, undefined, offset, pagination.pageSize);

  const handlePageChange = (page: number) => {
    setPagination({
      pageNum: page,
      pageSize: 10,
    });
  };

  const totalElements = Number(data?.totalElements ?? 0);

  return (
    <InfoWrapper>
      <Breadcrumbs prevLabel={t("claim.event.records")} currentLabel={t("common.details")} prevLink="/info-claim" />

      <Box mt="20px">
        <MainCard>
          <Box sx={{ overflow: "auto" }}>
            <Header sx={wrapperSx}>
              <HeaderCell>{t("common.address")}</HeaderCell>
              <HeaderCell>{t("common.token")}</HeaderCell>
              <HeaderCell>{t("claim.time")}</HeaderCell>
              <HeaderCell>{t("common.state")}</HeaderCell>
            </Header>

            {data?.content?.map((ele, index) => (
              <ClaimEventTransaction key={index} ele={ele} />
            ))}

            {data?.content?.length === 0 && !isLoading ? <NoData /> : null}

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
          </Box>

          {totalElements > 0 ? (
            <Pagination length={totalElements} page={pagination.pageNum} onPageChange={handlePageChange} />
          ) : null}
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
