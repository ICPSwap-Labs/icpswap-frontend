import { useState, useEffect } from "react";
import { WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";
import { TradeTransaction } from "@icpswap/types";
import { Copy } from "components/index";
import { useNFTTradeTransactions } from "@icpswap/hooks";
import upperFirst from "lodash/upperFirst";
import { shorten, timestampFormat, pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { Pagination, PaginationType, NoData, Header, HeaderCell, BodyCell, TableRow, ImageLoading } from "@icpswap/ui";
import { makeStyles, Box } from "components/Mui";

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
  reload?: boolean;
}

export function NFTActivity({ canisterId, tokenId, reload }: NFTActivityProps) {
  const { t } = useTranslation();
  const classes = useStyles();
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
      <Box sx={{ width: "100%" }}>
        <>
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
        </>
        {content.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>

      {content.length ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={onPageChange} />
      ) : null}
    </>
  );
}
