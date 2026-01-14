import { useState, useCallback, useMemo, useEffect } from "react";
import { makeStyles, Box } from "components/Mui";
import Copy from "components/Copy";
import { useNFTTransaction } from "hooks/nft/useNFTCalls";
import { pageArgsFormat, enumToString, arrayBufferToString, shorten, timestampFormat } from "@icpswap/utils";
import { encodeTokenIdentifier } from "utils/index";
import type { NFTTransaction as NFTTransactionType, PaginationResult } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { NoData } from "components/index";
import { useTranslation } from "react-i18next";
import { Header, HeaderCell, BodyCell, TableRow, ImageLoading, Pagination } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    },
  };
});

export default function NFTTransaction({
  canisterId,
  tokenId,
  reload,
}: {
  canisterId: string;
  tokenId: number;
  reload?: boolean;
}) {
  const classes = useStyles();
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
    () => result ?? ({ totalElements: 0, content: [], offset: 0, limit: 10 } as PaginationResult<NFTTransactionType>),
    [result],
  );

  const onPageChange = useCallback(
    (page: number) => {
      setPageNum(page);
    },
    [setPageNum],
  );

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ width: "100%", minWidth: "960px" }}>
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

                <BodyCell>
                  <Copy content={row.from}>{shorten(row.from, 6)}</Copy>
                </BodyCell>

                <Copy content={row.to}>
                  <BodyCell>{shorten(row.to, 6)}</BodyCell>
                </Copy>

                <BodyCell>{row.memo[0] ? arrayBufferToString(Uint8Array.from(row.memo[0])) : ""}</BodyCell>
              </TableRow>
            ))}
          </>
        </Box>
        {list.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>

      {list.length ? <Pagination length={Number(totalElements)} onPageChange={onPageChange} /> : null}
    </>
  );
}
