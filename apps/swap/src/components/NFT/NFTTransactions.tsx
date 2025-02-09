import { useState, useCallback, useMemo, useEffect } from "react";
import { Typography, Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import Copy from "components/Copy";
import { useNFTTransaction } from "hooks/nft/useNFTCalls";
import { pageArgsFormat, enumToString, arrayBufferToString, shorten, timestampFormat } from "@icpswap/utils";
import { encodeTokenIdentifier } from "utils/index";
import Pagination from "components/pagination";
import type { NFTTransaction, PaginationResult } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { NoData, ListLoading } from "components/index";
import { useTranslation } from "react-i18next";

export default function NFTTransaction({
  canisterId,
  tokenId,
  reload,
}: {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}) {
  const { t } = useTranslation();
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
              <TableCell>{t("common.time")}</TableCell>
              <TableCell>{t("common.type")}</TableCell>
              <TableCell>{t("common.from")}</TableCell>
              <TableCell>{t("common.to")}</TableCell>
              <TableCell>{t("common.memo")}</TableCell>
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
