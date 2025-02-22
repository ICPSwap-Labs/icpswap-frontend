import { useState } from "react";
import { TradeData } from "components/info/nft";
import { InfoWrapper, ListLoading } from "components/index";
import {
  MainCard,
  NoData,
  Pagination,
  PaginationType,
  TableRow,
  Header,
  HeaderCell,
  BodyCell,
  Flex,
} from "@icpswap/ui";
import { useNFTCanisterMetadata, useNFTOtherStat } from "hooks/info/nft";
import { formatAmount, parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { WRAPPED_ICP } from "@icpswap/tokens";
import { TradeStateResult } from "@icpswap/types";
import { useNFTsStat } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { Avatar, Box, makeStyles } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
    },
  };
});

export function NFTTradeStat({ data }: { data: TradeStateResult }) {
  const classes = useStyles();
  const { result: metadata } = useNFTCanisterMetadata(data.cid);
  const { result: stat } = useNFTOtherStat(data.cid);
  const [, holders] = stat ?? [0, "--"];

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>
        <Flex align="center" gap="0 5px">
          <Avatar src={metadata?.image}>&nbsp;</Avatar>
          <BodyCell>{metadata?.name ?? "--"}</BodyCell>
        </Flex>
      </BodyCell>

      <BodyCell>{metadata?.mintSupply ? Number(metadata?.mintSupply) : "--"}</BodyCell>
      <BodyCell>{String(holders)}</BodyCell>
      <BodyCell>{formatAmount(parseTokenAmount(data.floorPrice, WRAPPED_ICP.decimals).toNumber())}</BodyCell>
      <BodyCell>{formatAmount(parseTokenAmount(data.avgPrice, WRAPPED_ICP.decimals).toNumber())}</BodyCell>
      <BodyCell>{formatAmount(parseTokenAmount(data.totalTurnover, WRAPPED_ICP.decimals).toNumber())}</BodyCell>
      <BodyCell>{Number(data.listSize)}</BodyCell>
    </TableRow>
  );
}

export default function MarketPlace() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useNFTsStat(offset, pagination.pageSize);
  const { content, totalElements } = result ?? { totalElements: 0, content: [] as TradeStateResult[] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <InfoWrapper>
      <TradeData />

      <Box mt="24px">
        <MainCard>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Box sx={{ width: "100%", minWidth: "960px" }}>
              <Header className={classes.wrapper}>
                <HeaderCell>{t("common.name")}</HeaderCell>
                <HeaderCell>{t("common.items")}</HeaderCell>
                <HeaderCell>{t("common.holders")}</HeaderCell>
                <HeaderCell>{t("common.floor.price")}</HeaderCell>
                <HeaderCell>{t("common.average.price")}</HeaderCell>
                <HeaderCell>{t("common.total.volume")}</HeaderCell>
                <HeaderCell>{t("nft.transactions.listings")}</HeaderCell>
              </Header>

              <>
                {content.map((stat) => (
                  <NFTTradeStat key={stat.cid} data={stat} />
                ))}
              </>
            </Box>
            {content.length === 0 && !loading ? <NoData /> : null}
            <ListLoading loading={loading} />
          </Box>

          {totalElements && Number(totalElements) !== 0 ? (
            <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
          ) : null}
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
