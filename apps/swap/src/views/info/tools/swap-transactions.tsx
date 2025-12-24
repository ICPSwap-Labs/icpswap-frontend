import { useParsedQueryString, useSwapTransactions } from "@icpswap/hooks";
import { SelectPair, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import { Box, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import { BigNumber, isUndefinedOrNull, locationSearchReplace } from "@icpswap/utils";
import { Header, HeaderCell, Flex, TransactionRow, LoadingRow, Pagination, NoData, BreadcrumbsV1 } from "@icpswap/ui";
import { useTips, TIP_SUCCESS } from "hooks/index";
import copyToClipboard from "copy-to-clipboard";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools/index";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { SwapTransactionsDownload } from "components/info/tools/SwapTransactionsDownload";
import { TimeRange } from "components/TimeRange/TimeRange";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      padding: "24px",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(5, 1fr)",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1.5fr repeat(5, 1fr)",
        padding: "16px",
      },
    },
  };
});

const PageSize = 10;
const DEFAULT_PAGINATION = { pageNum: 1, pageSize: PageSize };

export default function SwapTransactions() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const [openTip] = useTips();

  const { pair, principal } = useParsedQueryString() as { pair: string; principal: string | undefined };

  const now = new Date().getTime();

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [startTime, setStartTime] = useState<undefined | number>(
    new BigNumber(now).minus(180 * 24 * 3600 * 1000).toNumber(),
  );
  const [endTime, setEndTime] = useState<undefined | number>(now);

  const { result, loading } = useSwapTransactions({
    principal,
    poolId: pair,
    page: pagination.pageNum,
    limit: PageSize,
    startTime,
    endTime,
  });

  const transactions = result?.content;

  const handlePairChange = (pairId: string | undefined) => {
    setPagination(DEFAULT_PAGINATION);

    const search = locationSearchReplace(location.search, "pair", pairId);

    history.push(`/info-tools/swap-transactions${search}`);
  };

  const handleAddressChange = (address: string | Null) => {
    setPagination(DEFAULT_PAGINATION);

    const search = locationSearchReplace(location.search, "principal", address);

    history.push(`/info-tools/swap-transactions${search}`);
  };

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  const handleCopy = useCallback((address: string) => {
    copyToClipboard(address);
    openTip(t`Copy Success`, TIP_SUCCESS);
  }, []);

  const handleTimeRangeChange = useCallback((startTime: number, endTime: number) => {
    setPagination(DEFAULT_PAGINATION);
    setStartTime(startTime);
    setEndTime(endTime);
  }, []);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("common.swap.transactions") }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={
          <Flex
            fullWidth
            justify="space-between"
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px 0",
              },
            }}
          >
            <Typography color="inherit" fontSize="inherit" fontWeight="inherit">
              {t("common.swap.transactions")}
            </Typography>

            <SwapTransactionsDownload pair={pair} principal={principal} startTime={startTime} endTime={endTime} />
          </Flex>
        }
        action={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px 16px",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              },
            }}
          >
            <Flex
              gap="12px 16px"
              sx={{
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                },
              }}
            >
              <PrincipalSearcher placeholder="Enter Principal ID to search" onPrincipalChange={handleAddressChange} />

              <TimeRange defaultRange={180} onChange={handleTimeRangeChange} />

              <Flex sx={{ width: "fit-content", minWidth: "214px" }} gap="0 4px">
                <Typography>{t("common.select.pair.colon")}</Typography>

                <SelectPair
                  value={pair}
                  onPairChange={handlePairChange}
                  search
                  showBackground={false}
                  panelPadding="0px"
                  defaultPanel={<Typography color="text.primary">{t("common.select.all.pair")}</Typography>}
                />
              </Flex>
              {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
            </Flex>
          </Box>
        }
      >
        <Box sx={{ width: "100%", overflow: "auto" }}>
          <Box sx={{ minWidth: "1152px" }}>
            <Box>
              <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
                <HeaderCell>#</HeaderCell>

                <HeaderCell field="amountUSD">{t("common.total.value")}</HeaderCell>

                <HeaderCell field="amountToken0">{t("common.token.amount")}</HeaderCell>

                <HeaderCell field="amountToken1">{t("common.token.amount")}</HeaderCell>

                <HeaderCell field="sender">{t("common.account")}</HeaderCell>

                <HeaderCell field="timestamp">{t("common.time")}</HeaderCell>
              </Header>

              {loading || isUndefinedOrNull(transactions) ? (
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
                  </LoadingRow>
                </Box>
              ) : transactions.length > 0 ? (
                <>
                  {transactions.map((transaction, index) => (
                    <TransactionRow
                      key={`${String(transaction.txTime)}_${index}`}
                      transaction={transaction}
                      className={classes.wrapper}
                      onCopy={handleCopy}
                    />
                  ))}

                  <Pagination
                    page={pagination.pageNum}
                    length={result?.totalElements ?? 0}
                    onPageChange={handlePageChange}
                    padding={{ lg: "24px 0", sm: "16px 0" }}
                  />
                </>
              ) : (
                <NoData tip={t("info.tools.swap.transactions.empty")} />
              )}
            </Box>
          </Box>
        </Box>
      </ToolsWrapper>
    </InfoWrapper>
  );
}
