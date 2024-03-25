import { useState, useCallback, useMemo, useEffect } from "react";
import { Typography, Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import NoData from "components/no-data";
import ListLoading from "components/Loading/List";
import Copy from "components/Copy";
import { useUserNFTTransactions } from "hooks/nft/useNFTCalls";
import { Pagination, TextButton } from "components/index";
import { Trans } from "@lingui/macro";
import type { PaginationResult, NFTTransaction } from "@icpswap/types";
import { useAccount } from "store/global/hooks";
import upperFirst from "lodash/upperFirst";
import { pageArgsFormat, enumToString, arrayBufferToString , shorten, timestampFormat } from "@icpswap/utils";

export default function CollectionUserTransactions({ canisterId }: { canisterId: string }) {
  const [pageNum, setPageNum] = useState(1);
  const [offset, limit] = pageArgsFormat(pageNum, 10);

  const account = useAccount();

  const { result, loading } = useUserNFTTransactions(canisterId, account, offset, limit);

  useEffect(() => {
    setPageNum(1);
  }, [setPageNum]);

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
                <Trans>Name</Trans>
              </TableCell>
              <TableCell>
                <Trans>NFT ID</Trans>
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
                  <Typography>{row.tokenName}</Typography>
                </TableCell>
                <TableCell>
                  <TextButton to={`/wallet/nft/view/${canisterId}/${row.tokenId}`}>#{row.tokenId}</TextButton>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        <Copy content={row.from}>{shorten(row.from, 12)}</Copy>
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        <Copy content={row.to}>{shorten(row.to, 12)}</Copy>
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
