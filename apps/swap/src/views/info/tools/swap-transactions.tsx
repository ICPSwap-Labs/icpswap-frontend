import { useSwapTransactions } from "hooks/info/swap/useScanSwapTransactions";
import { useParsedQueryString } from "@icpswap/hooks";
import { SelectPair, FilledTextField, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, makeStyles, useTheme, Theme } from "components/Mui";
import { Trans, t } from "@lingui/macro";
import { pageArgsFormat, locationSearchReplace, isValidPrincipal } from "@icpswap/utils";
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
import { ToolsWrapper } from "components/info/tools/Wrapper";

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
      },
    },
  };
});

const PageSize = 10;

export default function SwapTransactions() {
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

  const handleAddressChange = (address: string | undefined) => {
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
        links={[{ label: <Trans>Tools</Trans>, link: "/info-tools" }, { label: <Trans>Swap Transactions</Trans> }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={<Trans>Swap Transactions</Trans>}
        action={
          <Box
            sx={{
              display: "flex",
              margin: "10px 0 0 0",
              gap: "10px 16px",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Flex gap="0 16px">
              <Box
                sx={{
                  width: "343px",
                  height: "40px",
                  "@media(max-width: 640px)": {
                    width: "100%",
                  },
                }}
              >
                <FilledTextField
                  width="100%"
                  fullHeight
                  value={principal}
                  textFiledProps={{
                    slotProps: {
                      input: {
                        placeholder: `Search the principal for swap transactions`,
                      },
                    },
                  }}
                  placeholderSize="12px"
                  onChange={handleAddressChange}
                  background={theme.palette.background.level1}
                />

                {principal && !isValidPrincipal(principal) ? (
                  <Typography sx={{ margin: "3px 0 0 2px", fontSize: "12px" }} color="error.main">
                    <Trans>Invalid principal</Trans>
                  </Typography>
                ) : null}
              </Box>
              <Box sx={{ width: "fit-content", minWidth: "214px" }}>
                <SelectPair value={pair} onPairChange={handlePairChange} search />
              </Box>
              {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
            </Flex>

            <Button variant="contained" onClick={download} disabled={downloadLoading}>
              <Flex gap="0 4px">
                {downloadLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <Image src="/images/download.svg" sx={{ width: "16px", height: "16px", borderRadius: "0px" }} />
                )}
                <Trans>Export</Trans>
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

                <HeaderCell field="amountUSD">
                  <Trans>Total Value</Trans>
                </HeaderCell>

                <HeaderCell field="amountToken0">
                  <Trans>Token Amount</Trans>
                </HeaderCell>

                <HeaderCell field="amountToken1">
                  <Trans>Token Amount</Trans>
                </HeaderCell>

                <HeaderCell field="sender">
                  <Trans>Account</Trans>
                </HeaderCell>

                <HeaderCell field="timestamp">
                  <Trans>Time</Trans>
                </HeaderCell>
              </Header>

              {(transactions ?? []).map((transaction, index) => (
                <TransactionRow
                  key={`${String(transaction.timestamp)}_${index}`}
                  transaction={transaction}
                  className={classes.wrapper}
                  onAddressClick={handleCopy}
                />
              ))}

              {(transactions ?? []).length === 0 && !loading ? <NoData /> : null}

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
                <Box sx={{ padding: "24px" }}>
                  <Pagination
                    num={pagination.pageNum}
                    total={result?.totalElements ?? 0}
                    onPageChange={handlePageChange}
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
