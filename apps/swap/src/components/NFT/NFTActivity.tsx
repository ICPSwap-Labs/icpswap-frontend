import { useState, useCallback, useEffect } from "react";
import Copy from "components/Copy";
import { useTradeTxList } from "hooks/nft/trade";
import { pageArgsFormat, parseTokenAmount, shorten, timestampFormat } from "@icpswap/utils";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { TxRecord } from "types/index";
import upperFirst from "lodash/upperFirst";
import { useTranslation } from "react-i18next";
import { Box, makeStyles } from "components/Mui";
import { Header, HeaderCell, TableRow, BodyCell, ImageLoading, NoData, Pagination } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1.5fr 1.5fr 1fr 1fr",
    },
  };
});

export default function NFTActivity({
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
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, [reload, setPagination]);

  const { loading, result } = useTradeTxList(canisterId, null, tokenId, offset, pagination.pageSize, "time", true);
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TxRecord[] };

  const onPageChange = useCallback(
    (page: number) => {
      setPagination({ pageNum: page, pageSize: 10 });
    },
    [setPagination],
  );

  return (
    <>
      <Box sx={{ overflow: "auto", width: "100%" }}>
        <Box sx={{ width: "100%", minWidth: "960px" }}>
          <Header className={classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.seller")}</HeaderCell>
            <HeaderCell>{t("common.buyer")}</HeaderCell>
            <HeaderCell>{t("common.price")}</HeaderCell>
            <HeaderCell>{t("common.status")}</HeaderCell>
          </Header>

          <>
            {content.map((record, index) => (
              <TableRow key={`${Number(record.hash)}_${index}`} className={classes.wrapper}>
                <BodyCell>{timestampFormat(record.time)}</BodyCell>

                <Copy content={record.seller}>
                  <BodyCell>{shorten(record.seller, 6)}</BodyCell>
                </Copy>

                <Copy content={record.buyer}>
                  <BodyCell>{shorten(record.buyer, 6)}</BodyCell>
                </Copy>
                <BodyCell>
                  {parseTokenAmount(record.price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()}{" "}
                  {WRAPPED_ICP_TOKEN_INFO.symbol}
                </BodyCell>
                <BodyCell>{upperFirst(record.txStatus === "complete" ? "done" : record.txStatus)}</BodyCell>
              </TableRow>
            ))}
          </>
        </Box>
        {content.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>
      {content.length ? <Pagination length={Number(totalElements)} onPageChange={onPageChange} /> : null}
    </>
  );
}
