import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Pagination,
  Copy,
  LoadingRow,
  NoData,
  PaginationType,
  MainCard,
  Breadcrumbs,
  MainContainer,
} from "ui-component/index";
import { parseTokenAmount, pageArgsFormat, transactionsTypeFormat, shorten, timestampFormat } from "@icpswap/utils";
import { useTokenTransactions, useParsedQueryString } from "@icpswap/hooks";
import { Trans } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { useTokenInfo } from "hooks/token/index";
import { useStateTokenCapId, useTokenStandardIsRegistered, useUpdateTokenStandards } from "store/token/cache/hooks";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import upperFirst from "lodash/upperFirst";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";

export interface Transaction {
  fee: bigint | undefined;
  status: string;
  transType: string;
  from_owner: string;
  from_sub: number[] | undefined;
  from_account: string;
  to_owner: string;
  to_sub: number[] | undefined;
  to_account: string;
  hash: string;
  memo: [] | [Array<number>];
  timestamp: bigint;
  index: bigint;
  amount: bigint;
}

const useStyles = makeStyles(() => ({
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr) 120px",
    padding: "16px",
    alignItems: "center",
    minWidth: "1200px",
  },
}));

export function TransactionItem({ transaction, token }: { transaction: Transaction; token: TokenInfo | undefined }) {
  const classes = useStyles();

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{upperFirst(transactionsTypeFormat(transaction.transType))}</BodyCell>
      <BodyCell>{timestampFormat(transaction.timestamp)}</BodyCell>
      <BodyCell>
        <Copy content={transaction.from_owner}>
          <BodyCell color="primary.main">{shorten(transaction.from_owner, 8)}</BodyCell>
        </Copy>
      </BodyCell>
      <BodyCell>
        <Copy content={transaction.to_owner}>
          <BodyCell color="primary.main">{shorten(transaction.to_owner, 8)}</BodyCell>
        </Copy>
      </BodyCell>
      <BodyCell>
        {BigInt(transaction.amount ?? 0) === BigInt(Number.MAX_VALUE)
          ? "MAX VALUE"
          : parseTokenAmount(transaction.amount, token?.decimals).toFormat()}
      </BodyCell>
      <BodyCell>{parseTokenAmount(transaction.fee, token?.decimals).toFormat()}</BodyCell>
    </TableRow>
  );
}

export function Transactions() {
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageSize: 64, pageNum: 1 });
  const [searchValue] = useState<null | string>(null);

  const { canisterId } = useParams<{ canisterId: string }>();

  const capId = useStateTokenCapId(canisterId);

  const { result: tokenInfo } = useTokenInfo(canisterId);

  const [pageStart] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = useTokenTransactions({
    canisterId,
    account: searchValue,
    offset: pageStart,
    limit: pagination.pageSize,
    capId,
  });

  const { totalElements, content: list } = result || {
    totalElements: 0,
    content: [] as Transaction[],
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <MainContainer>
      <Breadcrumbs
        prevLink={`/token/details/${canisterId}`}
        prevLabel={<Trans>Token Details</Trans>}
        currentLabel={<Trans>Transactions</Trans>}
      />

      <Box sx={{ height: "20px" }} />

      <MainCard>
        <Grid container mb="20px">
          <Grid item xs>
            <Typography variant="h3">
              <Trans>Transactions</Trans>
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ position: "relative" }}>
          <Header className={classes.wrapper}>
            <HeaderCell>
              <Trans>Type</Trans>
            </HeaderCell>
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
              <Trans>Amount</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Fee</Trans>
            </HeaderCell>
          </Header>

          {!loading &&
            list.map((row, index) => (
              <TransactionItem key={`${String(row.timestamp)}_${index}`} transaction={row} token={tokenInfo} />
            ))}

          {list.length === 0 && !loading ? <NoData /> : null}

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
                <div />
                <div />
              </LoadingRow>
            </Box>
          ) : null}
        </Box>

        {list.length ? (
          <Pagination
            num={pagination.pageNum}
            total={Number(totalElements)}
            onPageChange={handlePageChange}
            defaultPageSize={pagination.pageSize}
          />
        ) : null}
      </MainCard>
    </MainContainer>
  );
}

export default function _Transactions() {
  const updateTokenStandard = useUpdateTokenStandards();

  const { canisterId } = useParams<{ canisterId: string; account: string }>();

  const { standard } = useParsedQueryString() as { standard: TOKEN_STANDARD };

  useEffect(() => {
    if (standard && canisterId !== "ICP") {
      updateTokenStandard({ canisterId, standard });
    }
  }, [standard, canisterId]);

  const tokenStandardIsRegistered = useTokenStandardIsRegistered(canisterId);

  return tokenStandardIsRegistered ? <Transactions /> : null;
}
