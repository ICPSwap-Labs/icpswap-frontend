import { useState } from "react";
import { Grid, Typography, Box, Avatar, makeStyles } from "components/Mui";
import { useNFTs } from "@icpswap/hooks";
import {
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  LoadingRow,
  Pagination,
  PaginationType,
  NoData,
  TextButton,
} from "@icpswap/ui";
import { shorten, pageArgsFormat } from "@icpswap/utils";
import { type NFTTokenMetadata } from "@icpswap/types";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr) 120px repeat(2, 1fr) 80px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

function NFTAvatar({ nft }: { nft: NFTTokenMetadata }) {
  return nft.fileType === "image" ? (
    <Avatar src={nft.filePath} />
  ) : (
    <Grid
      sx={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "linear-gradient(137.79deg, #7584D7 2.02%, #443D99 98.56%)",
        overflow: "hidden",
      }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Typography color="text.primary" fontSize="10px">
        {nft.fileType}
      </Typography>
    </Grid>
  );
}

export function NFTs({ canisterId }: { canisterId: string }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useNFTs({ canisterId, offset, limit: pagination.pageSize });
  const { content: NFTList, totalElements } = result ?? { totalElements: 0, content: [] as NFTTokenMetadata[] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <>
      <Box sx={{ overflow: "auto" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.nft")}</HeaderCell>
          <HeaderCell>{t("common.canister.name")}</HeaderCell>
          <HeaderCell>{t("nft.id")}</HeaderCell>
          <HeaderCell>{t("common.canister.id")}</HeaderCell>
          <HeaderCell>{t("common.owner")}</HeaderCell>
          <BodyCell>&nbsp;</BodyCell>
        </Header>

        {(loading ? [] : NFTList).map((nft) => (
          <TableRow key={`${Number(nft.tokenId)}-${nft.cId}`} className={classes.wrapper}>
            <BodyCell>
              <NFTAvatar nft={nft} />
            </BodyCell>
            <BodyCell>{nft.name}</BodyCell>
            <BodyCell>{Number(nft.tokenId)}</BodyCell>
            <BodyCell>{nft.cId}</BodyCell>
            <BodyCell>{shorten(nft.owner, 8)}</BodyCell>
            <BodyCell>
              <TextButton to={`/info-nfts/info/${canisterId}/${nft.tokenId}`}>{t("common.details")}</TextButton>
            </BodyCell>
          </TableRow>
        ))}

        {NFTList.length === 0 && !loading ? <NoData /> : null}

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
            <div />
          </LoadingRow>
        ) : null}
      </Box>

      {totalElements && Number(totalElements) !== 0 ? (
        <Pagination
          total={Number(totalElements)}
          num={pagination.pageNum}
          defaultPageSize={pagination.pageSize}
          onPageChange={handlePageChange}
        />
      ) : null}
    </>
  );
}
