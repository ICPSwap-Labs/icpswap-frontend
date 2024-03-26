import { useState, useMemo } from "react";
import { Typography, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import { encodeTokenIdentifier } from "utils/index";
import { Pagination, PaginationType, ListLoading, NoData, Copy } from "ui-component/index";
import { Trans } from "@lingui/macro";
import { NFTTransaction } from "@icpswap/types";
import { useNFTTransactions } from "@icpswap/hooks";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat, enumToString, pageArgsFormat, arrayBufferToString } from "@icpswap/utils";
import type { PaginationResult } from "@icpswap/types";

export interface NFTTransactionProps {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}

export default function _NFTTransaction({ canisterId, tokenId }: NFTTransactionProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset, limit] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useNFTTransactions({
    canisterId,
    tokenIdentifier: encodeTokenIdentifier(canisterId, tokenId),
    offset,
    limit,
  });

  const { content: list, totalElements } = useMemo(
    () => result ?? ({ totalElements: 0, content: [], offset: 0, limit: 10 } as PaginationResult<NFTTransaction>),
    [result],
  );

  const onPageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

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
                <Trans>From</Trans>
              </TableCell>
              <TableCell>
                <Trans>To</Trans>
              </TableCell>
              <TableCell>
                <Trans>Memo</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row, index) => (
              <TableRow key={`${Number(row.tokenId)}_${index}`}>
                <TableCell>
                  <Typography>{timestampFormat(row.time)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{upperFirst(enumToString(row.txType))}</Typography>
                </TableCell>
                <TableCell>
                  <Copy content={row.from}>
                    <Typography>{shorten(row.from, 8)}</Typography>
                  </Copy>
                </TableCell>
                <TableCell>
                  <Copy content={row.to}>
                    <Typography>{shorten(row.to, 8)}</Typography>
                  </Copy>
                </TableCell>
                <TableCell>
                  <Typography>{row.memo[0] ? arrayBufferToString(Uint8Array.from(row.memo[0])) : ""}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && !loading ? <NoData /> : null}
        <ListLoading loading={loading} />
      </TableContainer>
      {list.length ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </>
  );
}
