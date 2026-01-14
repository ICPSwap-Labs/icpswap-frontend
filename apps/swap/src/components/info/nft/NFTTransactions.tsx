import { useState, useMemo } from "react";
import { encodeTokenIdentifier } from "utils/index";
import { Copy } from "components/index";
import { NFTTransaction } from "@icpswap/types";
import { useNFTTransactions } from "@icpswap/hooks";
import { Pagination, NoData, Header, HeaderCell, BodyCell, TableRow, ImageLoading } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat, enumToString, pageArgsFormat, arrayBufferToString } from "@icpswap/utils";
import type { PaginationResult } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { makeStyles, Box } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 120px 1fr 1fr 120px",
    },
  };
});

export interface NFTTransactionProps {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}

export function NFTTransactions({ canisterId, tokenId }: NFTTransactionProps) {
  const { t } = useTranslation();
  const classes = useStyles();
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

  const onPageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <>
          <Header className={classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.type")}</HeaderCell>
            <HeaderCell>{t("common.from")}</HeaderCell>
            <HeaderCell>{t("common.to")}</HeaderCell>
            <HeaderCell>{t("common.memo")}</HeaderCell>
          </Header>

          <>
            {list.map((row, index) => (
              <TableRow key={`${Number(row.tokenId)}_${index}`} className={classes.wrapper}>
                <BodyCell>{timestampFormat(row.time)}</BodyCell>
                <BodyCell>{upperFirst(enumToString(row.txType))}</BodyCell>
                <Copy content={row.from}>
                  <BodyCell>{shorten(row.from, 8)}</BodyCell>
                </Copy>
                <Copy content={row.to}>
                  <BodyCell>{shorten(row.to, 8)}</BodyCell>
                </Copy>
                <BodyCell>{row.memo[0] ? arrayBufferToString(Uint8Array.from(row.memo[0])) : ""}</BodyCell>
              </TableRow>
            ))}
          </>
        </>
        {list.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>
      {list.length ? (
        <Pagination length={Number(totalElements)} page={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </>
  );
}
