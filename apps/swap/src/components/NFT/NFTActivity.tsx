import { useState, useCallback, useEffect } from "react";
import { Typography, Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import NoData from "components/no-data";
import ListLoading from "components/Loading/List";
import Copy from "components/Copy";
import { useTradeTxList } from "hooks/nft/trade";
import { pageArgsFormat, parseTokenAmount , shorten, timestampFormat } from "@icpswap/utils";
import Pagination from "components/pagination";
import { Trans } from "@lingui/macro";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { TxRecord } from "types/index";
import upperFirst from "lodash/upperFirst";

export default function NFTActivity({
  canisterId,
  tokenId,
  reload,
}: {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, [reload, setPagination]);

  const { loading, result } = useTradeTxList(canisterId, null, tokenId, offset, pagination.pageSize, "time", true);
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TxRecord[] };

  const onPageChange = useCallback(
    (pagination) => {
      setPagination(pagination);
    },
    [setPagination],
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
              {/* <TableCell>
                <Trans>Type</Trans>
              </TableCell> */}
              <TableCell>
                <Trans>seller</Trans>
              </TableCell>
              <TableCell>
                <Trans>buyer</Trans>
              </TableCell>
              <TableCell>
                <Trans>price</Trans>
              </TableCell>
              <TableCell>
                <Trans>status</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((record, index) => (
              <TableRow key={`${Number(record.hash)}_${index}`}>
                <TableCell>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">{timestampFormat(record.time)}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Copy content={record.seller}>
                    <Typography>{shorten(record.seller, 6)}</Typography>
                  </Copy>
                </TableCell>
                <TableCell>
                  <Copy content={record.buyer}>
                    <Typography>{shorten(record.buyer, 6)}</Typography>
                  </Copy>
                </TableCell>
                <TableCell>
                  <Typography>
                    {parseTokenAmount(record.price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()}{" "}
                    {WRAPPED_ICP_TOKEN_INFO.symbol}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{upperFirst(record.txStatus === "complete" ? "done" : record.txStatus)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {content.length === 0 && !loading ? <NoData /> : null}
        <ListLoading loading={loading} />
      </TableContainer>
      {content.length ? <Pagination count={Number(totalElements)} onPageChange={onPageChange} /> : null}
    </>
  );
}
