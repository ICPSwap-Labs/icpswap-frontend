import { useState } from "react";
import { Grid, Typography, Box, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import DetailItem from "ui-component/DetailItem";
import { WICPCanisterId } from "constants/canister";
import { cycleValueFormat, getExplorerPrincipalLink } from "utils/index";
import { parseTokenAmount, enumToString, pageArgsFormat , shorten, timestampFormat } from "@icpswap/utils";
import { useWrapOverview } from "hooks/useWICPCalls";
import { useWrapTransactions } from "@icpswap/hooks";
import { NoData, Pagination, Copy, LoadingRow, PaginationType, MainCard, MainContainer } from "ui-component/index";
import { ICP, WRAPPED_ICP } from "constants/tokens";
import { Theme } from "@mui/material/styles";
import upperFirst from "lodash/upperFirst";
import { Header, HeaderCell, BodyCell, Row } from "ui-component/Table";

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    background: theme.palette.background.level4,
    borderRadius: "12px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gridGap: "16px",
    "@media screen and (min-width:960px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridGap: "16px",
    },
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#313A5A",
    opacity: 0.4,
  },
  wrapper: {
    display: "grid",
    gap: "0 5px",
    alignItems: "center",
    gridTemplateColumns: "1fr 1fr 1fr 120px 160px",
  },
}));

export const ExchangeTypes: { [key: string]: string } = {
  wrap: "wrap",
  unwrap: "unwrap",
};

export default function Wrap() {
  const classes = useStyles();

  const { balance, supply, holders, cyclesBalance, counts } = useWrapOverview();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useWrapTransactions(undefined, offset, pagination.pageSize);

  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <MainContainer>
      <MainCard>
        <Grid className={classes.container} container spacing={2}>
          <Grid item xs={12}>
            <Box className={classes.box}>
              <DetailItem
                title={t`Total Supply`}
                value={parseTokenAmount(supply, ICP.decimals).toFormat()}
                border={{ borderRadius: "12px 0 0 0" }}
              />
              <Box className={classes.divider} />
              <DetailItem title={t`ICP Balance`} value={parseTokenAmount(balance, ICP.decimals).toFormat()} />
              <Box className={classes.divider} />
              <DetailItem title={t`Holders`} value={String(holders)} border={{ borderRadius: "0 0 0 12px" }} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.box}>
              <DetailItem
                title={t`Canister ID`}
                value={
                  <Link href={getExplorerPrincipalLink(WICPCanisterId)} target="_blank">
                    {WICPCanisterId}
                  </Link>
                }
                border={{ borderRadius: "12px 0 0 0" }}
              />
              <Box className={classes.divider} />
              <DetailItem title={t`Transactions`} value={String(counts)} />
              <Box className={classes.divider} />
              <DetailItem
                title={t`Cycles Balance`}
                value={cycleValueFormat(cyclesBalance)}
                border={{ borderRadius: "0 0 0 12px" }}
              />
            </Box>
          </Grid>
        </Grid>
      </MainCard>

      <Box mt="20px">
        <MainCard>
          <Typography variant="h3" component="div">
            <Trans>Transactions</Trans>
          </Typography>

          <Box mt="20px">
            <>
              <Header className={classes.wrapper}>
                <HeaderCell>
                  <Trans>Time</Trans>
                </HeaderCell>
                <HeaderCell>
                  <Trans>From</Trans>
                </HeaderCell>
                <HeaderCell>
                  <Trans>To</Trans>
                </HeaderCell>
                <HeaderCell>
                  <Trans>Type</Trans>
                </HeaderCell>
                <HeaderCell>
                  <Trans>Amount</Trans>
                </HeaderCell>
              </Header>

              {(loading ? [] : content).map((row, index) => (
                <Row key={index} className={classes.wrapper}>
                  <BodyCell>{timestampFormat(row.date)}</BodyCell>
                  <Copy content={row.from}>
                    <BodyCell color="primary.main">{shorten(row.from, 10)}</BodyCell>
                  </Copy>
                  <Copy content={row.to}>
                    <BodyCell color="primary.main">{shorten(row.to, 10)}</BodyCell>
                  </Copy>
                  <BodyCell>
                    {upperFirst(ExchangeTypes[enumToString(row.wrapType)] ?? enumToString(row.wrapType))}
                  </BodyCell>
                  <BodyCell>{parseTokenAmount(row.amount, WRAPPED_ICP.decimals).toFormat()}</BodyCell>
                </Row>
              ))}

              {content.length === 0 && !loading ? <NoData /> : null}

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
                </LoadingRow>
              ) : null}

              {Number(totalElements ?? 0) > 0 ? (
                <Pagination
                  total={Number(totalElements ?? 0)}
                  num={pagination.pageNum}
                  onPageChange={handlePageChange}
                />
              ) : null}
            </>
          </Box>
        </MainCard>
      </Box>
    </MainContainer>
  );
}
