import { useState, useMemo } from "react";
import { Typography, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import { encodeTokenIdentifier } from "utils/index";
import { Copy, ListLoading } from "components/index";
import { NFTTransaction } from "@icpswap/types";
import { useNFTTransactions } from "@icpswap/hooks";
import { Pagination, PaginationType, NoData } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat, enumToString, pageArgsFormat, arrayBufferToString } from "@icpswap/utils";
import type { PaginationResult } from "@icpswap/types";
import { useTranslation } from "react-i18next";

export interface NFTTransactionProps {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}

export function NFTTransactions({ canisterId, tokenId }: NFTTransactionProps) {
  const { t } = useTranslation();
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
