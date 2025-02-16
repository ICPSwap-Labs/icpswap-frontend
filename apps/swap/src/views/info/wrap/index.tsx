import { useState, ReactNode } from "react";
import { Grid, Typography, Box, Link, Theme, makeStyles } from "components/Mui";
import { WICPCanisterId } from "constants/canister";
import {
  parseTokenAmount,
  enumToString,
  pageArgsFormat,
  shorten,
  timestampFormat,
  explorerLink,
  cycleValueFormat,
} from "@icpswap/utils";
import { useWrapOverview } from "hooks/useWrap";
import { useWrapTransactions } from "@icpswap/hooks";
import { Copy, PaginationType, MainCard, InfoWrapper } from "components/index";
import { WRAPPED_ICP, ICP } from "@icpswap/tokens";
import upperFirst from "lodash/upperFirst";
import { Header, HeaderCell, TableRow, BodyCell, NoData, Pagination, LoadingRow } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

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

  itemTitle: {
    height: "60px",
    paddingLeft: "40px",
    background: theme.palette.background.level2,
    "@media(max-width: 640px)": {
      paddingLeft: "10px",
    },
  },
  itemContent: {
    height: "60px",
    width: "100%",
  },
}));

interface DetailsItemProps {
  title: ReactNode;
  value: ReactNode;
  CustomChild?: ReactNode;
  isAddress?: boolean;
  border?: { [key: string]: any };
}

function DetailItem({ title, value, CustomChild, isAddress, border }: DetailsItemProps) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={4}>
        <Grid container alignItems="center" className={classes.itemTitle} style={border}>
          <Typography
            component="span"
            sx={{
              fontSize: "16px",
              "@media(max-width: 640px)": {
                fontSize: "14px",
              },
            }}
          >
            {title}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={8} className={classes.itemContent}>
        <Grid
          container
          alignItems="center"
          sx={{
            paddingLeft: "46px",
            height: "100%",
            "@media(max-width: 640px)": {
              paddingLeft: "20px",
            },
          }}
        >
          {CustomChild || (
            <Grid item>
              {isAddress ? (
                // @ts-ignore
                <Copy content={value}>
                  <Typography fontWeight="500" fontSize="16px">
                    {value}
                  </Typography>
                </Copy>
              ) : (
                <Typography color="text.primary" fontSize="16px">
                  {value}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export const ExchangeTypes: { [key: string]: string } = {
  wrap: "wrap",
  unwrap: "unwrap",
};

export default function Wrap() {
  const classes = useStyles();
  const { t } = useTranslation();

  const { balance, supply, holders, cyclesBalance, counts } = useWrapOverview();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useWrapTransactions(undefined, offset, pagination.pageSize);

  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <InfoWrapper>
      <MainCard>
        <Grid className={classes.container} container spacing={2}>
          <Grid item xs={12}>
            <Box className={classes.box}>
              <DetailItem
                title={t("common.total.supply")}
                value={parseTokenAmount(supply, ICP.decimals).toFormat()}
                border={{ borderRadius: "12px 0 0 0" }}
              />
              <Box className={classes.divider} />
              <DetailItem
                title={t("common.balance.symbol", { symbol: "ICP" })}
                value={parseTokenAmount(balance, ICP.decimals).toFormat()}
              />
              <Box className={classes.divider} />
              <DetailItem title={t`Holders`} value={String(holders)} border={{ borderRadius: "0 0 0 12px" }} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.box}>
              <DetailItem
                title={t`Canister ID`}
                value={
                  <Link href={explorerLink(WICPCanisterId)} target="_blank">
                    {WICPCanisterId}
                  </Link>
                }
                border={{ borderRadius: "12px 0 0 0" }}
              />
              <Box className={classes.divider} />
              <DetailItem title={t`Transactions`} value={String(counts)} />
              <Box className={classes.divider} />
              <DetailItem
                title={t("common.cycles.balance")}
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
            {t("common.transactions")}
          </Typography>

          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Box
              sx={{
                margin: "20px 0 0 0",
                overflow: "auto",
                "@media(max-width: 640px)": {
                  minWidth: "1200px",
                },
              }}
            >
              <>
                <Header className={classes.wrapper}>
                  <HeaderCell>{t("common.time")}</HeaderCell>
                  <HeaderCell>{t("common.from")}</HeaderCell>
                  <HeaderCell>{t("common.to")}</HeaderCell>
                  <HeaderCell>{t("common.type")}</HeaderCell>
                  <HeaderCell>{t("common.amount")}</HeaderCell>
                </Header>

                {(loading ? [] : content).map((row, index) => (
                  <TableRow key={index} className={classes.wrapper}>
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
                  </TableRow>
                ))}

                {content.length === 0 && !loading ? <NoData /> : null}

                {loading ? (
                  <Box sx={{ padding: "24px" }}>
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
                  </Box>
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
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
