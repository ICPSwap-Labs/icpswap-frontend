import { pageArgsFormat, timestampFormat, cycleValueFormat } from "@icpswap/utils";
import { useState } from "react";
import { Typography, Box, Avatar, makeStyles } from "components/Mui";
import { useNFTCanisterCycles, useNFTCanisterCount } from "hooks/info/nft";
import { InfoWrapper } from "components/index";
import { NFTCanisterInfo } from "@icpswap/types";
import { useNFTCanisters } from "@icpswap/hooks";
import {
  MainCard,
  Pagination,
  NoData,
  LoadingRow,
  TextButton,
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  Flex,
} from "@icpswap/ui";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr) 120px 120px 80px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

export interface NFTItemProps {
  canister: NFTCanisterInfo;
}

export function NFTItem({ canister }: NFTItemProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { result: cycles } = useNFTCanisterCycles(canister.cid);
  const { result: count } = useNFTCanisterCount(canister.cid);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>
        <Flex fullWidth gap="0 6px" wrap="nowrap">
          <Avatar src={canister?.image}>&nbsp;</Avatar>
          <BodyCell title={canister.name}>{canister.name}</BodyCell>
        </Flex>
      </BodyCell>
      <BodyCell>{timestampFormat(canister.createTime)}</BodyCell>
      <BodyCell>{canister.cid}</BodyCell>
      <BodyCell>{cycleValueFormat(cycles ?? "")}</BodyCell>
      <BodyCell>{String(count ?? 0)}</BodyCell>
      <BodyCell>
        <TextButton to={`/info-nfts/canister/${canister.cid}`}>{t("common.details")}</TextButton>
      </BodyCell>
    </TableRow>
  );
}

const PAGE_SIZE = 10;

export default function NFTInfo() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [offset] = pageArgsFormat(page, PAGE_SIZE);

  const { result, loading } = useNFTCanisters(offset, PAGE_SIZE);
  const { content, totalElements } = result ?? { totalElements: 0, content: [] as NFTCanisterInfo[] };

  return (
    <InfoWrapper>
      <MainCard>
        <Box mb="20px">
          <Typography variant="h3">{t("nft.canisters")}</Typography>
        </Box>

        <Box sx={{ overflow: "auto" }}>
          <Header className={classes.wrapper}>
            <HeaderCell>{t("common.name")}</HeaderCell>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.canister.id")}</HeaderCell>
            <HeaderCell>{t("common.cycles")}</HeaderCell>
            <HeaderCell>{t("nft.nft.count")}</HeaderCell>
            <HeaderCell>&nbsp;</HeaderCell>
          </Header>

          {(loading ? [] : content).map((canister) => (
            <NFTItem key={canister.cid} canister={canister} />
          ))}

          {content.length === 0 && !loading ? <NoData /> : null}

          {loading ? (
            <Box sx={{ padding: "16px" }}>
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            </Box>
          ) : null}
        </Box>

        {totalElements && Number(totalElements) !== 0 ? (
          <Pagination length={Number(totalElements)} page={page} onPageChange={setPage} />
        ) : null}
      </MainCard>
    </InfoWrapper>
  );
}
