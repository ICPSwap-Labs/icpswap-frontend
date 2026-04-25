import { BodyCell, Header, HeaderCell, ImageLoading, NoData, Pagination, TableRow } from "@icpswap/ui";
import { pageArgsFormat, parseTokenAmount, shorten, timestampFormat } from "@icpswap/utils";
import Copy from "components/Copy";
import { Box } from "components/Mui";
import { WRAPPED_ICP } from "constants/index";
import { useTradeTxList } from "hooks/nft/trade";
import upperFirst from "lodash/upperFirst";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TxRecord } from "types/index";

const wrapperSx = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1.5fr 1.5fr 1fr 1fr",
};

export default function NFTActivity({ canisterId, tokenId }: { canisterId: string; tokenId: number }) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: 10 });
  }, []);

  const { isLoading: loading, data: result } = useTradeTxList(
    canisterId,
    null,
    tokenId,
    offset,
    pagination.pageSize,
    "time",
    true,
  );
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TxRecord[] };

  const onPageChange = useCallback((page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  }, []);

  return (
    <>
      <Box sx={{ overflow: "auto", width: "100%" }}>
        <Box sx={{ width: "100%", minWidth: "960px" }}>
          <Header sx={wrapperSx}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.seller")}</HeaderCell>
            <HeaderCell>{t("common.buyer")}</HeaderCell>
            <HeaderCell>{t("common.price")}</HeaderCell>
            <HeaderCell>{t("common.status")}</HeaderCell>
          </Header>

          {content.map((record, index) => (
            <TableRow key={`${Number(record.hash)}_${index}`} sx={wrapperSx}>
              <BodyCell>{timestampFormat(record.time)}</BodyCell>

              <Copy content={record.seller}>
                <BodyCell>{shorten(record.seller, 6)}</BodyCell>
              </Copy>

              <Copy content={record.buyer}>
                <BodyCell>{shorten(record.buyer, 6)}</BodyCell>
              </Copy>
              <BodyCell>
                {parseTokenAmount(record.price, WRAPPED_ICP.decimals).toFormat()} {WRAPPED_ICP.symbol}
              </BodyCell>
              <BodyCell>{upperFirst(record.txStatus === "complete" ? "done" : record.txStatus)}</BodyCell>
            </TableRow>
          ))}
        </Box>
        {content.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>
      {content.length ? <Pagination length={Number(totalElements)} onPageChange={onPageChange} /> : null}
    </>
  );
}
