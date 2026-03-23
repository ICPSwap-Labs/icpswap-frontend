import { useNFTTradeTransactions } from "@icpswap/hooks";
import { WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";
import type { TradeTransaction } from "@icpswap/types";
import { BodyCell, Header, HeaderCell, ImageLoading, NoData, Pagination, TableRow } from "@icpswap/ui";
import { pageArgsFormat, parseTokenAmount, shorten, timestampFormat } from "@icpswap/utils";
import { Copy } from "components/index";
import { Box, makeStyles } from "components/Mui";
import upperFirst from "lodash/upperFirst";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 120px 1fr 1fr 120px",
    },
  };
});

export interface NFTActivityProps {
  canisterId: string;
  tokenId: number;
}

export function NFTActivity({ canisterId, tokenId }: NFTActivityProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, []);

  const { isLoading: loading, data: result } = useNFTTradeTransactions({
    canisterId,
    name: undefined,
    tokenIndex: BigInt(tokenId),
    offset,
    limit: pagination.pageSize,
    sort: "time",
    desc: true,
  });
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TradeTransaction[] };

  const onPageChange = (page: number) => {
    setPagination({
      pageNum: page,
      pageSize: 10,
    });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.time")}</HeaderCell>
          <HeaderCell>{t("common.seller")}</HeaderCell>
          <HeaderCell>{t("common.buyer")}</HeaderCell>
          <HeaderCell>{t("common.price")}</HeaderCell>
          <HeaderCell>{t("common.status")}</HeaderCell>
        </Header>

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
        {content.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>

      {content.length ? (
        <Pagination length={Number(totalElements)} page={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </>
  );
}
