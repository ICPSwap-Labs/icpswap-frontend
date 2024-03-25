import { useSwapTransactions } from "hooks/info/useScanSwapTransactions";
import { useParsedQueryString } from "@icpswap/hooks";
import { LoadingRow, SelectPair, Pagination, PaginationType, Copy, NoData } from "ui-component/index";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import { formatDollarAmount, formatAmount, enumToString, pageArgsFormat, shorten } from "@icpswap/utils";
import { Header, HeaderCell, BodyCell, Row } from "ui-component/Table/index";
import { PoolStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
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

  const { pair } = useParsedQueryString() as { pair: string };

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

    if (pairId) {
      history.push(`/swap-scan/transactions?pair=${pairId}`);
    } else {
      history.push(`/swap-scan/transactions`);
    }
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, [address]);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "1200px" }}>
        <Box sx={{ display: "flex", margin: "10px 0 0 0", gap: "0 16px", alignItems: "center" }}>
          <Box sx={{ width: "fit-content", minWidth: "214px" }}>
            <SelectPair value={pair} onPairChange={handlePairChange} />
          </Box>
          {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
        </Box>

        <Box>
          <Header className={classes.wrapper}>
            <HeaderCell>#</HeaderCell>

            <HeaderCell field="amountUSD" isSort>
              <Trans>Total Value</Trans>
            </HeaderCell>

            <HeaderCell field="amountToken0" isSort>
              <Trans>Token Amount</Trans>
            </HeaderCell>

            <HeaderCell field="amountToken1" isSort>
              <Trans>Token Amount</Trans>
            </HeaderCell>

            <HeaderCell field="sender" isSort>
              <Trans>Account</Trans>
            </HeaderCell>

            <HeaderCell field="timestamp" isSort>
              <Trans>Time</Trans>
            </HeaderCell>
          </Header>

          {(transactions ?? []).map((transaction, index) => (
            <Row key={`${String(transaction.timestamp)}_${index}`} className={classes.wrapper}>
              <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

              <BodyCell>{formatDollarAmount(transaction.amountUSD, 3)}</BodyCell>

              <BodyCell>
                {formatAmount(transaction.token0ChangeAmount, 6)} {transaction.token0Symbol}
              </BodyCell>

              <BodyCell>
                {formatAmount(transaction.token1ChangeAmount, 6)} {transaction.token1Symbol}
              </BodyCell>

              <BodyCell>
                <Copy content={transaction.recipient}>
                  <BodyCell color="primary.main">{shorten(transaction.recipient, 8)}</BodyCell>
                </Copy>
              </BodyCell>

              <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
            </Row>
          ))}

          {(transactions ?? []).length === 0 && !loading ? <NoData /> : null}

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
            </LoadingRow>
          ) : null}

          {!loading && !!transactions?.length ? (
            <Box mt="20px">
              <Pagination num={pagination.pageNum} total={result?.totalElements ?? 0} onPageChange={handlePageChange} />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default function SwapScanTransactions() {
  return <SwapScanWrapper>{({ address }: ScanChildrenProps) => <Transactions address={address} />}</SwapScanWrapper>;
}
