import { useMemo, useState, useCallback, useContext } from "react";
import { TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Typography } from "@mui/material";
import { useAccount } from "store/auth/hooks";
import { NoData, Pagination, ListLoading } from "components/index";
import { Trans } from "@lingui/macro";
import { useUserExchangeRecord } from "hooks/useWICPCalls";
import { enumToString, pageArgsFormat, parseTokenAmount, timestampFormat } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import WrapContext from "components/Wrap/context";

const pageSize = 5;

const ExchangeType: { [key: string]: string } = {
  unwrap: "Unwrap",
  wrap: "Wrap",
};

export default function WICPRecord() {
  const account = useAccount();
  const [pageNum, setPageNum] = useState(1);
  const [pageStart] = useMemo(() => pageArgsFormat(pageNum, pageSize), [pageNum, pageSize]);

  const { retryTrigger } = useContext(WrapContext);

  const { result, loading } = useUserExchangeRecord(account, pageStart, pageSize, retryTrigger);
  const { totalElements, content: list = [] } = result || {};

  const onPageChange = useCallback(({ pageNum }) => {
    setPageNum(pageNum);
  }, []);

  return (
    <>
      <TableContainer className={loading ? "with-loading" : ""}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Time</Trans>
              </TableCell>
              <TableCell>
                <Trans>Type</Trans>
              </TableCell>
              <TableCell>
                <Trans>Amount</Trans>
              </TableCell>
              <TableCell>
                <Trans>Block</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography>{timestampFormat(row.date)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{ExchangeType[enumToString(row.wrapType)] ?? enumToString(row.wrapType)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{parseTokenAmount(row.amount, ICP.decimals).toFormat()}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{String(row.blockHeight)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && !loading ? <NoData /> : null}
        {loading ? <ListLoading loading={loading} mask={false} /> : null}
      </TableContainer>
      {Number(totalElements ?? 0) > 0 ? (
        <Pagination count={Number(totalElements || 0)} onPageChange={onPageChange} defaultPageSize={pageSize} flexEnd />
      ) : null}
    </>
  );
}
