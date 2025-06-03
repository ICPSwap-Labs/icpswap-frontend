import { useSwapTransactions } from "hooks/info/swap/useScanSwapTransactions";
import { useParsedQueryString } from "@icpswap/hooks";
import { SelectPair, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, makeStyles, useTheme, Theme } from "components/Mui";
import { pageArgsFormat, locationSearchReplace } from "@icpswap/utils";
import {
  Header,
  HeaderCell,
  Flex,
  TransactionRow,
  LoadingRow,
  Pagination,
  PaginationType,
  NoData,
  BreadcrumbsV1,
  Image,
} from "@icpswap/ui";
import { useSwapScanTransactionDownload } from "hooks/info/swap/useSwapScanDownloadTransaction";
import { useTips, TIP_SUCCESS } from "hooks/index";
import copyToClipboard from "copy-to-clipboard";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools/index";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

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

export default function SwapTransactions() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const [openTip] = useTips();

  const { pair, principal } = useParsedQueryString() as { pair: string; principal: string | undefined };

  const { download, loading: downloadLoading } = useSwapScanTransactionDownload({ pair, principal });

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: PageSize });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useSwapTransactions({
    principal,
    pair,
    offset,
    limit: PageSize,
  });

  const transactions = result?.content;

  const handlePairChange = (pairId: string | undefined) => {
    setPagination({ pageNum: 1, pageSize: 10 });

    const search = locationSearchReplace(location.search, "pair", pairId);

    history.push(`/info-tools/swap-transactions${search}`);
  };

  const handleAddressChange = (address: string | Null) => {
    setPagination({ pageNum: 1, pageSize: 10 });

    const search = locationSearchReplace(location.search, "principal", address);

    history.push(`/info-tools/swap-transactions${search}`);
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const handleCopy = useCallback((address: string) => {
    copyToClipboard(address);
    openTip(t`Copy Success`, TIP_SUCCESS);
  }, []);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("common.swap.transactions") }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={t("common.swap.transactions")}
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
              <PrincipalSearcher
                placeholder="Search the principal for swap transactions"
                onPrincipalChange={handleAddressChange}
              />
              <Flex sx={{ width: "fit-content", minWidth: "214px" }} gap="0 4px">
                <Typography>{t("common.select.pair.colon")}</Typography>

                <SelectPair
                  value={pair}
                  onPairChange={handlePairChange}
                  search
                  showClean={false}
                  showBackground={false}
                  panelPadding="0px"
                  defaultPanel={<Typography color="text.primary">{t("common.select.all.pair")}</Typography>}
                />
              </Flex>
              {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
            </Flex>

            <Button variant="contained" onClick={download} disabled={downloadLoading}>
              <Flex gap="0 4px">
                {downloadLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <Image src="/images/download.svg" sx={{ width: "16px", height: "16px", borderRadius: "0px" }} />
                )}
                {t("common.export")}
              </Flex>
            </Button>
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

              {(transactions ?? []).map((transaction, index) => (
                <TransactionRow
                  key={`${String(transaction.timestamp)}_${index}`}
                  transaction={transaction}
                  className={classes.wrapper}
                  onCopy={handleCopy}
                />
              ))}

              {(transactions ?? []).length === 0 && !loading ? (
                <NoData tip={t("info.tools.swap.transactions.empty")} />
              ) : null}

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
                  </LoadingRow>
                </Box>
              ) : null}

              {!loading && !!transactions?.length ? (
                <Box
                  sx={{
                    padding: "24px",
                    "@media screen and (max-width: 780px)": {
                      padding: "16px",
                    },
                  }}
                >
                  <Pagination
                    num={pagination.pageNum}
                    total={result?.totalElements ?? 0}
                    onPageChange={handlePageChange}
                    mt="0px"
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </ToolsWrapper>
    </InfoWrapper>
  );
}
