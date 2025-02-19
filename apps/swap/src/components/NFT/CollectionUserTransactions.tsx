import { useState, useCallback, useMemo } from "react";
import { makeStyles } from "components/Mui";
import Copy from "components/Copy";
import { useUserNFTTransactions } from "hooks/nft/useNFTCalls";
import { Pagination, TextButton, NoData } from "components/index";
import type { PaginationResult, NFTTransaction } from "@icpswap/types";
import { useAccountPrincipalString } from "store/auth/hooks";
import upperFirst from "lodash/upperFirst";
import { pageArgsFormat, enumToString, arrayBufferToString, shorten, timestampFormat } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { TableRow, Header, HeaderCell, BodyCell, LoadingRow } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      alignItems: "center",
      gridTemplateColumns: "1.5fr 120px repeat(4, 1fr) 170px",
    },
  };
});

export default function CollectionUserTransactions({ canisterId }: { canisterId: string }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pageNum, setPageNum] = useState(1);
  const [offset, limit] = pageArgsFormat(pageNum, 10);

  const principal = useAccountPrincipalString();

  const { result, loading } = useUserNFTTransactions(canisterId, principal, offset, limit);

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
      {loading ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : (
        <>
          <Header className={classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.type")}</HeaderCell>
            <HeaderCell>{t("common.name")}</HeaderCell>
            <HeaderCell>{t("nft.id")}</HeaderCell>
            <HeaderCell>{t("common.from")}</HeaderCell>
            <HeaderCell>{t("common.to")}</HeaderCell>
            <HeaderCell>{t("common.memo")}</HeaderCell>
          </Header>

          {list.map((row, index) => (
            <TableRow key={`${row.time}_${index}`} className={classes.wrapper}>
              <BodyCell>{timestampFormat(row.time)}</BodyCell>

              <BodyCell>{upperFirst(enumToString(row.txType))}</BodyCell>
              <BodyCell>{row.tokenName}</BodyCell>
              <BodyCell>
                <TextButton to={`/wallet/nft/view/${canisterId}/${row.tokenId}`}>#{row.tokenId}</TextButton>
              </BodyCell>

              <BodyCell>
                <Copy content={row.from}>{shorten(row.from, 4)}</Copy>
              </BodyCell>

              <BodyCell>
                <Copy content={row.to}>{shorten(row.to, 4)}</Copy>
              </BodyCell>

              <BodyCell>{row.memo[0] ? arrayBufferToString(Uint8Array.from(row.memo[0])) : ""}</BodyCell>
            </TableRow>
          ))}

          {list.length === 0 && !loading ? <NoData /> : null}

          {list.length ? <Pagination count={Number(totalElements)} onPageChange={onPageChange} /> : null}
        </>
      )}
    </>
  );
}
