import { useSwapTransactions } from "hooks/info/useScanSwapTransactions";
import { useParsedQueryString } from "@icpswap/hooks";
import { LoadingRow, SelectPair, Pagination, PaginationType, NoData } from "ui-component/index";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, makeStyles } from "ui-component/Mui";
import { Trans, t } from "@lingui/macro";
import { pageArgsFormat, locationSearchReplace } from "@icpswap/utils";
import { Header, HeaderCell, Flex, TransactionRow } from "@icpswap/ui";
import { useSwapScanTransactionDownload } from "hooks/info/useSwapScanDownloadTransaction";
import { useTips, TIP_SUCCESS } from "hooks/index";
import copyToClipboard from "copy-to-clipboard";

import SwapScanWrapper, { ScanChildrenProps } from "./SwapScanWrapper";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(5, 1fr)",

      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1.5fr repeat(5, 1fr)",
      },
    },
  };
});

const PageSize = 10;

interface TransactionsProps {
  address: string | undefined;
}

function Transactions({ address }: TransactionsProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [openTip] = useTips();

  const { pair } = useParsedQueryString() as { pair: string };

  const { download, loading: downloadLoading } = useSwapScanTransactionDownload({ pair, principal: address });

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: PageSize });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useSwapTransactions({
    principal: address,
    pair,
    offset,
    limit: PageSize,
  });

  const transactions = result?.content;

  const handlePairChange = (pairId: string | undefined) => {
    setPagination({ pageNum: 1, pageSize: 10 });

    const search = locationSearchReplace(location.search, "pair", pairId);

    history.push(`/swap-scan/transactions${search}`);
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, [address]);

  const handleCopy = useCallback((address: string) => {
    copyToClipboard(address);
    openTip(t`Copy Success`, TIP_SUCCESS);
  }, []);

  return (
    <>
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
          <Box sx={{ width: "fit-content", minWidth: "214px" }}>
            <SelectPair value={pair} onPairChange={handlePairChange} search />
          </Box>
          {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
        </Flex>

        <Button
          variant="contained"
          onClick={download}
          disabled={downloadLoading}
          startIcon={downloadLoading ? <CircularProgress color="inherit" size={22} /> : null}
        >
          <Trans>Download: Excel Export</Trans>
        </Button>
      </Box>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <Box>
            <Header className={classes.wrapper}>
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
              <Box mt="20px">
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
    </>
  );
}

export default function SwapScanTransactions() {
  return <SwapScanWrapper>{({ address }: ScanChildrenProps) => <Transactions address={address} />}</SwapScanWrapper>;
}
