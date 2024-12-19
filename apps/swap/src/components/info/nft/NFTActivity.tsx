import { useState, useEffect } from "react";
import { Typography, Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import { Trans } from "@lingui/macro";
import { WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";
import { TradeTransaction } from "@icpswap/types";
import { Copy, ListLoading } from "components/index";
import { useNFTTradeTransactions } from "@icpswap/hooks";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat, pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { Pagination, PaginationType, NoData } from "@icpswap/ui";

export interface NFTActivityProps {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}

export function NFTActivity({ canisterId, tokenId, reload }: NFTActivityProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, [reload, setPagination]);

  const { loading, result } = useNFTTradeTransactions({
    canisterId,
    name: undefined,
    tokenIndex: BigInt(tokenId),
    offset,
    limit: pagination.pageSize,
    sort: "time",
    desc: true,
  });
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TradeTransaction[] };

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
                {/* <TableCell>
                  <Typography variant="h6">{upperFirst(enumToString(record.txType))}</Typography>
                </TableCell> */}
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

      {content.length ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </>
  );
}
