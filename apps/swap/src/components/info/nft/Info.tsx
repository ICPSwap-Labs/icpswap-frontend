import { ReactElement } from "react";
import { Typography, Grid, Box, Link, useMediaQuery, useTheme, makeStyles, Theme } from "components/Mui";
import { Copy } from "components/index";
import { NFTVerifyLabel } from "components/info/nft/VerifyLabel";
import LazyImage from "components/LazyImage";
import { isICPSwapOfficial, encodeTokenIdentifier, arrayBufferToString } from "utils/index";
import { useTradeOrder } from "@icpswap/hooks";
import { openBase64ImageInNewWindow, mockALinkAndOpen, shorten, timestampFormat, BigNumber } from "@icpswap/utils";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import { Flex, TextButton } from "@icpswap/ui";
import type { NFTTokenMetadata } from "@icpswap/types";
import { useNFTCanisterMetadata } from "hooks/info/nft";
import ExplorerLink from "components/ExternalLink/Explorer";
import { useTranslation } from "react-i18next";

import DetailsToggle from "./DetailsToggle";
import FileImage from "./FileImage";
import CollectionIcons from "./collectionsIcon";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "510px auto",
      gridAutoRows: "max-content",
      gap: "0 30px",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
        gap: "24px 0",
      },
    },

    leftWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridAutoRows: "max-content",
      gap: "30px 0",
      [theme.breakpoints.down("md")]: {
        gap: "24px 0",
      },
    },

    rightWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridAutoRows: "max-content",
      gap: "30px 0",
      [theme.breakpoints.down("md")]: {
        gap: "24px 0",
      },
    },

    logoWrapper: {
      position: "relative",
      width: "510px",
      height: "510px",
      borderRadius: "4px",
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "100%",
        maxHeight: "100%",
      },
    },

    metadataWrapper: {
      // gridArea: "2 / 1 / auto / auto",
    },

    infoWrapper: {
      // gridArea: "1 / 2 / auto / auto",
    },

    detailsWrapper: {
      // gridArea: "2 / 2 / auto / auto",
    },

    collectionsWrapper: {
      // gridArea: "3 / 2 / auto / auto",
    },
  };
});

export type NFTMetadata1 = { label: string; value: string };
export type NFTMetadata2 = { k: string; v: string };

export type NFTMetadata = NFTMetadata1 | NFTMetadata2;

export function metadataFormat(metadata: NFTTokenMetadata | undefined): NFTMetadata[] {
  if (metadata && !!metadata.metadata && !!metadata.metadata[0]) {
    return JSON.parse(arrayBufferToString(Uint8Array.from(metadata.metadata[0])));
  }

  return [];
}

export function isMetadata1(metadata: any): metadata is NFTMetadata1 {
  if (metadata.label) return true;
  return false;
}

interface DetailsItemProps {
  label: string;
  value: undefined | string | number | ReactElement;
}

export const DetailsItem = ({ label, value }: DetailsItemProps) => {
  return (
    <Flex fullWidth justify="space-between" align="flex-start" gap="0 20px">
      <Typography
        sx={{
          "@media(max-width: 640px)": {
            fontSize: "12px",
          },
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          wordBreak: "break-word",
          textAlign: "right",
          "@media(max-width: 640px)": {
            fontSize: "12px",
          },
        }}
      >
        {value}
      </Typography>
    </Flex>
  );
};

export function NFTMetadataWrapper({ metadata }: { metadata: NFTMetadata }) {
  const theme = useTheme();

  return (
    <Box>
      <Grid
        container
        sx={{
          border: `1px solid ${theme.colors.secondaryMain}`,
          borderRadius: "8px",
          background: theme.palette.background.level4,
        }}
      >
        <Box sx={{ padding: "10px 5px", width: "100%" }}>
          <Typography align="center" color="secondary" fontWeight="500">
            {isMetadata1(metadata) ? metadata.label : metadata.k}
          </Typography>
          <Typography
            mt="10px"
            align="center"
            color="text.primary"
            fontWeight="500"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {isMetadata1(metadata) ? metadata.value : metadata.v}
          </Typography>
        </Box>
      </Grid>
    </Box>
  );
}

export type PositionSVG = {
  image: string;
};

export interface NFTInfoProps {
  canisterId: string;
  tokenId: number;
  isView?: boolean;
}

export function NFTInfo({ canisterId, tokenId, isView }: NFTInfoProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const { result: canisterMetadata } = useNFTCanisterMetadata(canisterId);

  const { metadata } = useNFTMetadata(canisterId, tokenId);

  const NFTMetadata = metadataFormat(metadata);

  const { result: orderInfo } = useTradeOrder(canisterId, Number(tokenId));

  // const NFTUSDValue = useUSDValueFromICPAmount(orderInfo?.price);

  const handleImageClick = () => {
    if (!metadata || !metadata.filePath) return;

    if (metadata.filePath.includes("base64")) {
      openBase64ImageInNewWindow(metadata.filePath);
      return;
    }

    mockALinkAndOpen(metadata.filePath, "file_path");
  };

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box className={classes.wrapper}>
        <Box className={classes.leftWrapper}>
          <Box className={classes.logoWrapper}>
            <Grid
              item
              sx={{ position: "relative", background: theme.palette.background.level3, borderRadius: "8px" }}
              container
              justifyContent="center"
            >
              {metadata ? (
                <LazyImage
                  src={metadata.filePath}
                  showDefault={metadata.fileType !== "image"}
                  CustomImage={
                    metadata?.fileType !== "image" && !!metadata?.fileType ? (
                      <FileImage fileType={metadata.fileType ?? ""} />
                    ) : null
                  }
                  onClick={handleImageClick}
                  boxSX={{
                    cursor: "pointer",
                  }}
                />
              ) : null}
            </Grid>
          </Box>

          {!matchDownMD && NFTMetadata.length > 0 ? (
            <Box className={classes.metadataWrapper}>
              <DetailsToggle title={t("common.metadata")}>
                <Grid container spacing="10px">
                  {NFTMetadata.map((metadata, index) => (
                    <Grid item xs={4} key={index}>
                      <NFTMetadataWrapper metadata={metadata} />
                    </Grid>
                  ))}
                </Grid>
              </DetailsToggle>
            </Box>
          ) : null}
        </Box>

        <Box className={classes.rightWrapper}>
          <Box className={classes.infoWrapper}>
            <Grid container>
              <Typography color="secondary">{canisterMetadata?.name}</Typography>
              {isICPSwapOfficial(metadata?.minter) ? (
                <Grid item sx={{ marginLeft: "5px" }}>
                  <NFTVerifyLabel />
                </Grid>
              ) : null}
            </Grid>
            <Box mt="14px">
              <Typography
                className="text-overflow-ellipsis"
                variant="h3"
                color="text.primary"
                sx={{
                  fontSize: "26px",
                  fontWeight: 700,
                  maxWidth: "680px",
                  wordBreak: "break-all",
                }}
                component="span"
              >
                {metadata?.name}#{String(metadata?.tokenId ?? "")}
              </Typography>
            </Box>
            <Box mt="18px">
              <Typography component="span" sx={{ marginRight: "5px" }}>
                {t("common.owned.by")}
              </Typography>
              <TextButton>{shorten(metadata?.owner, 12)}</TextButton>
            </Box>
            {Boolean(orderInfo?.price) && (
              <Grid container mt="25px" alignItems="end">
                <Grid item>
                  {/* <WICPPriceFormat
                    price={orderInfo?.price}
                    fontSize="28px"
                    imgSize="28px"
                    fontWeight={700}
                    align="end"
                  /> */}
                </Grid>
                {/* {NFTUSDValue ? (
                  <Grid item xs sx={{ marginLeft: "10px" }}>
                    <Typography fontSize="16px">({formatDollarAmount(NFTUSDValue?.toNumber())})</Typography>
                  </Grid>
                ) : null} */}
              </Grid>
            )}
            {isView && (
              <Grid container alignItems="center" mt="30px">
                <Grid item xs>
                  <Grid container justifyContent="flex-start" />
                </Grid>
              </Grid>
            )}
          </Box>

          <Box className={classes.detailsWrapper}>
            <DetailsToggle title={t("nft.details")}>
              <Flex vertical gap="15px" fullWidth align="flex-start">
                <DetailsItem
                  label={t`Token ID`}
                  value={
                    metadata && !!metadata.cId && !!metadata.tokenId
                      ? encodeTokenIdentifier(metadata.cId, metadata.tokenId)
                      : "--"
                  }
                />
                {metadata && !metadata.filePath?.includes("base64") ? (
                  <DetailsItem
                    label={t("common.file.link")}
                    value={
                      <Link
                        href={metadata.filePath}
                        target="_blank"
                        sx={{
                          wordBreak: "break-all",
                        }}
                      >
                        {metadata.filePath}
                      </Link>
                    }
                  />
                ) : null}
                <DetailsItem
                  label={t("nft.mint.time")}
                  value={metadata ? timestampFormat(metadata.mintTime?.toString() ?? "--") : "--"}
                />
                <DetailsItem
                  label={t("nft.minter")}
                  value={
                    <Copy content={metadata ? metadata.minter : ""}>
                      {metadata ? shorten(metadata.minter, 12) : "--"}
                    </Copy>
                  }
                />

                <Flex fullWidth vertical align="flex-start" gap="8px">
                  <Typography
                    sx={{
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {t("nft.description")}
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: "20px",
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >{`${metadata ? metadata.introduction : "--"}`}</Typography>
                </Flex>
              </Flex>
            </DetailsToggle>
          </Box>

          <Box className={classes.collectionsWrapper}>
            <DetailsToggle title={t("common.about.collections")}>
              <Flex fullWidth gap="15px 0" vertical align="flex-start">
                <DetailsItem
                  label={t`NFT Canister ID`}
                  value={
                    <ExplorerLink label={metadata ? metadata.cId : "--"} value={metadata ? metadata.cId ?? "" : "--"} />
                  }
                />

                <Flex fullWidth vertical align="flex-start" gap="8px">
                  <Typography
                    sx={{
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {t("nft.collection.description")}
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: "20px",
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {canisterMetadata?.introduction ?? "--"}
                  </Typography>
                </Flex>

                <DetailsItem
                  label={t("common.creator")}
                  value={<Copy content={canisterMetadata?.owner ?? ""}>{shorten(canisterMetadata?.owner, 12)}</Copy>}
                />
                <DetailsItem
                  label={t("nft.creator.royalty")}
                  value={`${new BigNumber(String(canisterMetadata?.royalties ?? 0)).dividedBy(100).toFormat()}%`}
                />
              </Flex>
              {!!canisterMetadata?.linkMap && canisterMetadata?.linkMap?.length > 0 ? (
                <Box mt="20px">
                  <CollectionIcons links={canisterMetadata?.linkMap} />
                </Box>
              ) : null}
            </DetailsToggle>
          </Box>

          {matchDownMD && NFTMetadata.length > 0 ? (
            <Box className={classes.metadataWrapper}>
              <DetailsToggle title={t("common.metadata")}>
                <Grid container spacing="10px">
                  {NFTMetadata.map((metadata, index) => (
                    <Grid item xs={4} key={index}>
                      <NFTMetadataWrapper metadata={metadata} />
                    </Grid>
                  ))}
                </Grid>
              </DetailsToggle>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
