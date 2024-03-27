import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TransferDetail from "ui-component/transfer-detail";
import {
  Pagination,
  Copy,
  StaticLoading,
  NoData,
  PaginationType,
  MainCard,
  Breadcrumbs,
  MainContainer,
} from "ui-component/index";
import {
  parseTokenAmount,
  pageArgsFormat,
  transactionsTypeFormat,
  principalToAccount,
  shorten,
  timestampFormat,
} from "@icpswap/utils";
import { TransferDetailIcon } from "assets/images/icons";
import { useTokenTransactions, useParsedQueryString } from "@icpswap/hooks";
import { Trans } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { useTokenInfo } from "hooks/token/index";
import { useStateTokenCapId, useUpdateTokenStandards, useTokenStandardIsRegistered } from "store/token/cache/hooks";
import { Principal } from "@dfinity/principal";
import { TOKEN_STANDARD } from "@icpswap/constants";
import { useICPTransactions } from "hooks/useICPCalls";
import upperFirst from "lodash/upperFirst";

const useStyles = makeStyles(() => ({
  address: {
    width: "160px",
  },
}));

export interface TransactionItemProps {
  transaction: Transaction;
  token: TokenInfo | undefined;
}

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

export function TransactionItem({ transaction, token }: TransactionItemProps) {
  const classes = useStyles();
  const [detailShow, setDetailsShow] = useState(false);

  const handleDetailClick = () => {
    setDetailsShow(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography>{upperFirst(transactionsTypeFormat(transaction.transType))}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{timestampFormat(transaction.timestamp)}</Typography>
        </TableCell>
        <TableCell className={classes.address}>
          <Copy content={transaction.from_owner}>
            <Typography>{shorten(transaction.from_owner, 8)}</Typography>
          </Copy>
        </TableCell>
        <TableCell className={classes.address}>
          <Copy content={transaction.to_owner}>
            <Typography>{shorten(transaction.to_owner, 8)}</Typography>
          </Copy>
        </TableCell>
        <TableCell>
          <Typography>
            {BigInt(transaction.amount ?? 0) === BigInt(Number.MAX_VALUE)
              ? "MAX VALUE"
              : parseTokenAmount(transaction.amount, token?.decimals).toFormat()}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>{parseTokenAmount(transaction.fee, token?.decimals).toFormat()}</Typography>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<TransferDetailIcon />}
            onClick={handleDetailClick}
          >
            <Trans>Details</Trans>
          </Button>
        </TableCell>
      </TableRow>

      {detailShow ? (
        <TransferDetail open={detailShow} detail={transaction} onClose={() => setDetailsShow(false)} />
      ) : null}
    </>
  );
}

export interface TransactionsMainProps {
  loading: boolean;
  list: Transaction[];
  totalElements: number;
  onPageChange: (pagination: PaginationType) => void;
  pagination: PaginationType;
  tokenInfo: TokenInfo | undefined;
}

export function TransactionsMain({
  loading,
  list,
  totalElements,
  onPageChange,
  pagination,
  tokenInfo,
}: TransactionsMainProps) {
  return (
    <MainCard>
      <Grid container mb="20px">
        <Grid item xs>
          <Typography variant="h3">
            <Trans>Transactions</Trans>
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ position: "relative", minHeight: "694px" }}>
        <TableContainer className={loading ? "with-loading" : ""} sx={{ maxHeight: "694px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans>Type</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Time</Trans>
                </TableCell>
                <TableCell>
                  <Trans>From</Trans>
                </TableCell>
                <TableCell>
                  <Trans>To</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Amount</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Fee</Trans>
                </TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row, index) => (
                <TransactionItem key={`${String(row.timestamp)}_${index}`} transaction={row} token={tokenInfo} />
              ))}
            </TableBody>
          </Table>
          {list.length === 0 && !loading ? <NoData /> : null}
        </TableContainer>
        <StaticLoading loading={loading} />
      </Box>
      {list.length ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </MainCard>
  );
}

export function ICPTransactions() {
  const [pagination, setPagination] = useState({ pageSize: 64, pageNum: 1 });
  const { account: _account } = useParams<{ canisterId: string; account: string }>();

  const { result: tokenInfo } = useTokenInfo("aaaaa-aa");

  const account = useMemo(() => {
    if (_account.includes("-")) return principalToAccount(_account);
    return _account;
  }, [_account]);

  const { result: ICPTransactions, loading } = useICPTransactions(account);

  const { totalElements, list } = useMemo(() => {
    if (!ICPTransactions || !ICPTransactions.transactions || ICPTransactions.transactions.length === 0)
      return {
        list: [] as Transaction[],
        totalElements: 0,
      };

    const list = ICPTransactions?.transactions.map((item, index) => {
      const { transaction } = item;
      const { operations, metadata, transaction_identifier } = transaction || {};

      return {
        index: BigInt(index),
        timestamp: BigInt(metadata.timestamp),
        hash: transaction_identifier?.hash ?? "",
        // @ts-ignore
        memo: metadata.memo as [],
        // block_height: metadata.block_height,
        status: operations[0]?.status,
        transType: operations[0]?.type ?? "",
        from_owner: operations[0]?.account?.address,
        from_account: "",
        from_sub: undefined,
        to_owner: operations[1]?.account?.address,
        to_account: "",
        to_sub: undefined,
        // decimals: BigInt(operations[0]?.amount?.currency?.decimals),
        // symbol: operations[0]?.amount?.currency?.symbol,
        amount: BigInt(operations[1]?.amount?.value),
        fee: BigInt(-Number(operations[2]?.amount?.value)),
      } as Transaction;
    });

    const start = (pagination.pageNum - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;

    const content = list.length ? list.slice(start, end) : list.slice(start, end);
    const totalElements = list.length || list.length;

    return {
      list: content,
      totalElements,
    };
  }, [ICPTransactions, pagination]);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TransactionsMain
      onPageChange={handlePageChange}
      list={list}
      totalElements={totalElements}
      tokenInfo={tokenInfo}
      loading={loading}
      pagination={pagination}
    />
  );
}

export function TokenTransactions() {
  const [pagination, setPagination] = useState({ pageSize: 64, pageNum: 1 });
  const { canisterId, account: _account } = useParams<{ canisterId: string; account: string }>();

  const capId = useStateTokenCapId(canisterId);
  const { result: tokenInfo } = useTokenInfo(canisterId);

  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const account = useMemo(() => {
    if (_account.includes("-")) return Principal.fromText(_account);
    return _account;
  }, [_account]);

  const { loading, result } = useTokenTransactions({
    canisterId,
    account,
    offset,
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
    <TransactionsMain
      onPageChange={handlePageChange}
      list={list}
      totalElements={totalElements}
      tokenInfo={tokenInfo}
      loading={loading}
      pagination={pagination}
    />
  );
}

export default function Transactions() {
  const updateTokenStandard = useUpdateTokenStandards();

  const { canisterId } = useParams<{ canisterId: string; account: string }>();

  const { standard } = useParsedQueryString() as { standard: TOKEN_STANDARD };

  useEffect(() => {
    if (standard && canisterId !== "ICP") {
      updateTokenStandard({ canisterId, standard });
    }
  }, [standard, canisterId]);

  const isICP = canisterId === "ICP";

  const tokenStandardIsRegistered = useTokenStandardIsRegistered(canisterId);

  return (
    <MainContainer>
      <Breadcrumbs
        prevLink={isICP ? `/token/list` : `/token/details/${canisterId}`}
        prevLabel={isICP ? <Trans>Token List</Trans> : <Trans>Token Details</Trans>}
        currentLabel={<Trans>Transactions</Trans>}
      />

      <Box sx={{ height: "20px" }} />

      {isICP ? <ICPTransactions /> : tokenStandardIsRegistered ? <TokenTransactions /> : null}
    </MainContainer>
  );
}
