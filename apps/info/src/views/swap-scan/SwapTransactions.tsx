import { useSwapTransactions } from "hooks/info/useScanSwapTransactions";
import { useParsedQueryString } from "@icpswap/hooks";
import { LoadingRow, SelectPair, Pagination, PaginationType, Copy, NoData } from "ui-component/index";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import {
  formatDollarAmount,
  formatAmount,
  enumToString,
  pageArgsFormat,
  shorten,
  locationSearchReplace,
} from "@icpswap/utils";
import { Header, HeaderCell, TableRow, BodyCell, SwapTransactionPriceTip, Flex } from "@icpswap/ui";
import { PoolStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
import { useSwapScanTransactionDownload } from "hooks/info/useSwapScanDownloadTransaction";

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

export function ActionTypeFormat(transaction: PoolStorageTransaction) {
  const type = enumToString(transaction.action);

  let swapDesc = "";

  switch (type) {
    case "swap":
      swapDesc = t`Swap ${transaction.token0Symbol} for ${transaction.token1Symbol}`;
      break;
    case "increaseLiquidity":
    case "addLiquidity":
    case "mint":
      swapDesc = t`Add ${transaction.token0Symbol} and ${transaction.token1Symbol}`;
      break;
    case "decreaseLiquidity":
      swapDesc = t`Remove ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    case "claim":
      swapDesc = t`Collect ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    default:
      break;
  }

  return swapDesc;
}

const PageSize = 10;

interface TransactionsProps {
  address: string | undefined;
}

function Transactions({ address }: TransactionsProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

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
              <TableRow key={`${String(transaction.timestamp)}_${index}`} className={classes.wrapper}>
                <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

                <BodyCell>{formatDollarAmount(transaction.amountUSD, 3)}</BodyCell>

                <BodyCell sx={{ gap: "0 4px" }}>
                  {formatAmount(transaction.token0ChangeAmount, 4)}
                  <SwapTransactionPriceTip
                    symbol={transaction.token0Symbol}
                    price={transaction.token0Price}
                    symbolSx={{
                      "@media(max-width: 640px)": {
                        fontSize: "14px",
                      },
                    }}
                  />
                </BodyCell>

                <BodyCell sx={{ gap: "0 4px" }}>
                  {formatAmount(transaction.token1ChangeAmount, 4)}
                  <SwapTransactionPriceTip
                    symbol={transaction.token1Symbol}
                    price={transaction.token1Price}
                    symbolSx={{
                      "@media(max-width: 640px)": {
                        fontSize: "14px",
                      },
                    }}
                  />
                </BodyCell>

                <BodyCell>
                  <Copy content={transaction.recipient}>
                    <BodyCell color="primary.main">{shorten(transaction.recipient, 8)}</BodyCell>
                  </Copy>
                </BodyCell>

                <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
              </TableRow>
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
