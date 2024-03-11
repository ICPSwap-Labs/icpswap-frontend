import { useState, useCallback, useMemo, useEffect } from "react";
import { Typography, Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import NoData from "components/no-data";
import ListLoading from "components/Loading/List";
import Copy from "components/Copy";
import { useNFTTransaction } from "hooks/nft/useNFTCalls";
import { pageArgsFormat, enumToString, arrayBufferToString } from "@icpswap/utils";
import { encodeTokenIdentifier } from "utils/index";
import Pagination from "components/pagination";
import { Trans } from "@lingui/macro";
import type { NFTTransaction, PaginationResult } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat } from "@icpswap/utils";

export default function NFTTransaction({
  canisterId,
  tokenId,
  reload,
}: {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}) {
  const [pageNum, setPageNum] = useState(1);
  const [offset, limit] = pageArgsFormat(pageNum, 10);

  const { result, loading } = useNFTTransaction(
    canisterId,
    encodeTokenIdentifier(canisterId, tokenId),
    offset,
    limit,
    reload,
  );

  useEffect(() => {
    setPageNum(1);
  }, [reload, setPageNum]);

  const { content: list, totalElements } = useMemo(
    () => result ?? ({ totalElements: 0, content: [], offset: 0, limit: 10 } as PaginationResult<NFTTransaction>),
    [result],
  );

  const onPageChange = useCallback(
    ({ pageNum }) => {
      setPageNum(pageNum);
    },
    [setPageNum],
  );

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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">{timestampFormat(row.time)}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{upperFirst(enumToString(row.txType))}</Typography>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        <Copy content={row.from}>{shorten(row.from, 18)}</Copy>
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        <Copy content={row.to}>{shorten(row.to, 18)}</Copy>
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {row.memo[0] ? arrayBufferToString(Uint8Array.from(row.memo[0])) : ""}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && !loading ? <NoData /> : null}
        <ListLoading loading={loading} />
      </TableContainer>
      {list.length ? <Pagination count={Number(totalElements)} onPageChange={onPageChange} /> : null}
    </>
  );
}
