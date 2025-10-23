import { ReactElement, useState } from "react";
import { Typography, Grid, Button, Box, Link, useMediaQuery, useTheme, makeStyles, Theme } from "components/Mui";
import Copy from "components/Copy";
import { useICPAmountUSDValue } from "store/global/hooks";
import { useAccount } from "store/auth/hooks";
import NFTVerifyLabel from "components/NFT/VerifyLabel";
import { isICPSwapOfficial, encodeTokenIdentifier, arrayBufferToString } from "utils/index";
import {
  formatDollarAmount,
  mockALinkAndOpen,
  shorten,
  timestampFormat,
  BigNumber,
  isUndefinedOrNull,
} from "@icpswap/utils";
import { useNFTOrderInfo } from "hooks/nft/trade";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import NFTTransfer from "components/NFT/Transfer";
import NFTSell from "components/NFT/market/Sell";
import WICPPriceFormat from "components/NFT/WICPPriceFormat";
import NFTBuyReview from "components/NFT/market/NFTBuyReview";
import NFTRevoke from "components/NFT/market/NFTRevoke";
import { TextButton } from "components/index";
import { Null, type NFTTokenMetadata } from "@icpswap/types";
import { useCanisterMetadata } from "hooks/nft/useNFTCalls";
import NFTCanisterLink from "components/info/NFTCanisterLink";
import { TwitterIcon } from "assets/images/Twitter";
import { APP_URL } from "constants/index";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

import NFTAvatar from "./NFTAvatar";
import CollectionIcons from "./collectionsIcon";
import DetailsToggle from "./DetailsToggle";

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

export function metadataFormat(metadata: NFTTokenMetadata | Null): NFTMetadata[] {
  if (isUndefinedOrNull(metadata)) return [];

  if (!!metadata.metadata && !!metadata.metadata[0]) {
    return JSON.parse(arrayBufferToString(Uint8Array.from(metadata.metadata[0])));
  }

  return [];
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

export function isMetadata1(metadata: any): metadata is NFTMetadata1 {
  if (metadata.label) return true;
  return false;
}

export function NFTMetadataWrapper({ metadata }: { metadata: NFTMetadata }) {
  const theme = useTheme() as Theme;

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

export default function NFTInfo({
  canisterId,
  tokenId,
  isView,
}: {
  canisterId: string;
  tokenId: number | bigint;
  isView?: boolean;
}) {
  const { t } = useTranslation();
  const account = useAccount();
  const theme = useTheme() as Theme;
  const classes = useStyles();

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [buyReviewShow, setBuyReviewShow] = useState(false);
  const [reload, setReload] = useState(false);

  const { result: canisterMetadata } = useCanisterMetadata(canisterId);

  const { metadata } = useNFTMetadata(canisterId, tokenId, reload);

  const NFTMetadata = metadataFormat(metadata);

  const isOwner = metadata?.owner === account;

  const { result: orderInfo } = useNFTOrderInfo(canisterId, tokenId, reload);

  const isOnSale = Boolean(orderInfo);

  const NFTUsdPrice = useICPAmountUSDValue(orderInfo?.price);

  const handleRevokeSuccess = () => {
    setReload(!reload);
  };

  const handleTransferSuccess = () => {
    setReload(!reload);
    setTransferModalOpen(false);
  };

  const handleOnListSuccess = () => {
    setReload(!reload);
    setSellModalOpen(false);
  };

  const handleOnTradeSuccess = () => {
    setReload(!reload);
    setBuyReviewShow(false);
  };

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleToTwitter = () => {
    const twitterLink = `https://twitter.com/intent/tweet?url=${APP_URL}/wallet/nft/view/${canisterId}/${tokenId}&text=Look at ${
      isOwner ? "my" : "this"
    } NFT "${metadata?.name}" on ICPSwap (The Hub of Future Decentralized Finance)! &via=ICPSwap`;

    mockALinkAndOpen(twitterLink, "NFT_share_to_Twitter");
  };

  return (
    <>
      <Box className={classes.wrapper}>
        <Box className={classes.leftWrapper}>
          <Box className={classes.logoWrapper}>
            <Grid
              item
              sx={{ position: "relative", background: theme.palette.background.level2, borderRadius: "8px" }}
              container
              justifyContent="center"
            >
              <NFTAvatar metadata={metadata} autoPlay />
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
              <TextButton to={`/marketplace/NFT/${canisterMetadata?.cid}`}>{canisterMetadata?.name}</TextButton>
              {isICPSwapOfficial(metadata?.minter) ? (
                <Grid item sx={{ marginLeft: "5px" }}>
                  <NFTVerifyLabel />
                </Grid>
              ) : null}
              {metadata?.owner ? (
                <Grid item xs>
                  <Grid container justifyContent="flex-end">
                    <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleToTwitter}>
                      <TwitterIcon />
                    </Box>
                  </Grid>
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
                  "@media (max-width: 680px)": {
                    maxWidth: "320px",
                    fontSize: "22px",
                  },
                }}
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
                  <WICPPriceFormat
                    price={orderInfo?.price}
                    fontSize="28px"
                    imgSize="28px"
                    fontWeight={700}
                    align="end"
                  />
                </Grid>
                {NFTUsdPrice ? (
                  <Grid item xs sx={{ marginLeft: "10px" }}>
                    <Typography fontSize="16px">({formatDollarAmount(NFTUsdPrice?.toNumber())})</Typography>
                  </Grid>
                ) : null}
              </Grid>
            )}
            {isView && (
              <Grid container alignItems="center" mt="30px">
                <Grid item xs>
                  <Grid container justifyContent="flex-start">
                    {!isOnSale && isOwner ? (
                      <Button
                        sx={{
                          borderRadius: "4px",
                        }}
                        size="large"
                        variant="contained"
                        onClick={() => setSellModalOpen(true)}
                      >
                        {t`Sell`}
                      </Button>
                    ) : null}
                    {isOnSale && !isOwner ? (
                      <Button
                        sx={{
                          borderRadius: "4px",
                        }}
                        size="large"
                        variant="contained"
                        onClick={() => setBuyReviewShow(true)}
                      >
                        {t("nft.buy")}
                      </Button>
                    ) : null}
                    {isOwner && !isOnSale && (
                      <Button
                        sx={{
                          marginLeft: "18px",
                          borderRadius: "4px",
                        }}
                        size="large"
                        variant="contained"
                        onClick={() => setTransferModalOpen(true)}
                      >
                        {t("common.transfer")}
                      </Button>
                    )}
                    {isOwner && isOnSale && <NFTRevoke metadata={metadata} onRevokeSuccess={handleRevokeSuccess} />}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>

          <Box className={classes.detailsWrapper}>
            <DetailsToggle title={t("nft.details")}>
              <Flex fullWidth vertical gap="15px" align="flex-start">
                <DetailsItem
                  label={t`Token ID`}
                  value={
                    metadata && !!metadata.cId && (!!metadata.tokenId || metadata.tokenId === 0)
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
                <DetailsItem label={t("nft.mint.time")} value={metadata ? timestampFormat(metadata.mintTime) : "--"} />
                <DetailsItem
                  label={t("nft.minter")}
                  value={<Copy content={metadata?.minter ?? ""}>{shorten(metadata?.minter, 12)}</Copy>}
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
              <Flex fullWidth vertical gap="15px" align="flex-start">
                <DetailsItem label={t`NFT Canister ID`} value={<NFTCanisterLink canisterId={metadata?.cId} />} />
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
                  value={
                    <Copy content={canisterMetadata?.owner ?? ""}>{shorten(canisterMetadata?.owner ?? "", 12)}</Copy>
                  }
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
      {transferModalOpen && metadata ? (
        <NFTTransfer
          canisterId={canisterId}
          nft={metadata}
          open={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          onTransferSuccess={handleTransferSuccess}
        />
      ) : null}
      {sellModalOpen && metadata ? (
        <NFTSell
          canisterId={canisterId}
          nft={metadata}
          open={sellModalOpen}
          onClose={() => setSellModalOpen(false)}
          onSellSuccess={handleOnListSuccess}
        />
      ) : null}
      <NFTBuyReview
        open={buyReviewShow}
        onClose={() => setBuyReviewShow(false)}
        order={orderInfo}
        onTradeSuccess={handleOnTradeSuccess}
      />
    </>
  );
}
