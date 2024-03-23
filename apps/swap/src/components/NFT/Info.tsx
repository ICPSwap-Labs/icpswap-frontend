import { ReactElement, useState } from "react";
import { Typography, Grid, Button, Box, Link, useMediaQuery } from "@mui/material";
import { useTheme, makeStyles } from "@mui/styles";
import Copy from "components/Copy";
import { useAccount } from "store/global/hooks";
import NFTVerifyLabel from "components/NFT/VerifyLabel";
import { isICPSwapOfficial } from "utils/index";
import { formatDollarAmount, mockALinkAndOpen } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Trans, t } from "@lingui/macro";
import { useNFTOrderInfo } from "hooks/nft/trade";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import { Theme } from "@mui/material/styles";
import NFTTransfer from "components/NFT/Transfer";
import NFTSell from "components/NFT/market/Sell";
import { useICPAmountUSDValue } from "store/global/hooks";
import WICPPriceFormat from "components/NFT/WICPPriceFormat";
import NFTBuyReview from "components/NFT/market/NFTBuyReview";
import NFTRevoke from "components/NFT/market/NFTRevoke";
import { TextButton } from "components/index";
import DetailsToggle from "./DetailsToggle";
import { encodeTokenIdentifier, arrayBufferToString } from "utils/index";
import { type NFTTokenMetadata } from "@icpswap/types";
import { useCanisterMetadata } from "hooks/nft/useNFTCalls";
import CollectionIcons from "./collectionsIcon";
import NFTCanisterLink from "components/info/NFTCanisterLink";
import { TwitterIcon } from "assets/images/Twitter";
import { APP_URL } from "constants/index";
import NFTAvatar from "./NFTAvatar";
import { shorten, timestampFormat } from "@icpswap/utils";

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

export function metadataFormat(metadata: NFTTokenMetadata): NFTMetadata[] {
  if (!!metadata.metadata && !!metadata.metadata[0]) {
    return JSON.parse(arrayBufferToString(Uint8Array.from(metadata.metadata[0])));
  }

  return [];
}

export const DetailsItem = ({ label, value }: { label: string; value: undefined | string | number | ReactElement }) => {
  return (
    <Grid item>
      <Grid container alignItems="top">
        <Grid item mr="20px">
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs>
          <Grid
            container
            justifyContent="flex-end"
            sx={{
              wordBreak: "break-word",
              textAlign: "right",
            }}
          >
            {value}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export function isMetadata1(metadata: any): metadata is NFTMetadata1 {
  if (!!metadata.label) return true;
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
  const account = useAccount();
  const theme = useTheme() as Theme;
  const classes = useStyles();

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [buyReviewShow, setBuyReviewShow] = useState(false);
  const [reload, setReload] = useState(false);

  const { result: canisterMetadata } = useCanisterMetadata(canisterId);

  const metadata = useNFTMetadata(canisterId, tokenId, reload);

  const NFTMetadata = metadataFormat(metadata);

  const isOwner = metadata.owner === account;

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
    } NFT "${metadata.name}" on ICPSwap (The Hub of Future Decentralized Finance)! &via=ICPSwap`;

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
              <DetailsToggle title={<Trans>Metadata</Trans>}>
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
              {!!metadata?.owner ? (
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
                variant="h3"
                color="text.primary"
                sx={{
                  fontSize: "26px",
                  fontWeight: 700,
                  ...theme.mixins.overflowEllipsis,
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
                <Trans>Owned by</Trans>
              </Typography>
              <TextButton>{shorten(metadata.owner, 12)}</TextButton>
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
                        {t`Buy NFT`}
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
                        <Trans>Transfer</Trans>
                      </Button>
                    )}
                    {isOwner && isOnSale && <NFTRevoke metadata={metadata} onRevokeSuccess={handleRevokeSuccess} />}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>

          <Box className={classes.detailsWrapper}>
            <DetailsToggle title={<Trans>NFT Details</Trans>}>
              <Grid container flexDirection="column" spacing="15px">
                <DetailsItem
                  label={t`Token ID`}
                  value={
                    !!metadata.cId && (!!metadata.tokenId || metadata.tokenId === 0)
                      ? encodeTokenIdentifier(metadata.cId, metadata.tokenId)
                      : "--"
                  }
                />
                {!metadata.filePath?.includes("base64") ? (
                  <DetailsItem
                    label={t`File Link`}
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
                <DetailsItem label={t`Mint Time`} value={timestampFormat(metadata.mintTime)} />
                <DetailsItem
                  label={t`Minter`}
                  value={<Copy content={metadata.minter ?? ""}>{shorten(metadata.minter, 12)}</Copy>}
                />
                <DetailsItem label={t`NFT Description`} value={`${metadata.introduction}`} />
              </Grid>
            </DetailsToggle>
          </Box>

          <Box className={classes.collectionsWrapper}>
            <DetailsToggle title={<Trans>About Collections</Trans>}>
              <Grid container flexDirection="column" spacing="15px">
                <DetailsItem label={t`NFT Canister ID`} value={<NFTCanisterLink canisterId={metadata.cId} />} />
                <DetailsItem label={t`Collections Description`} value={canisterMetadata?.introduction} />
                <DetailsItem
                  label={t`Creator`}
                  value={
                    <Copy content={canisterMetadata?.owner ?? ""}>{shorten(canisterMetadata?.owner ?? "", 12)}</Copy>
                  }
                />
                <DetailsItem
                  label={t`Creator Royalty`}
                  value={`${new BigNumber(String(canisterMetadata?.royalties ?? 0)).dividedBy(100).toFormat()}%`}
                />
              </Grid>
              {!!canisterMetadata?.linkMap && canisterMetadata?.linkMap?.length > 0 ? (
                <Box mt="20px">
                  <CollectionIcons links={canisterMetadata?.linkMap} />
                </Box>
              ) : null}
            </DetailsToggle>
          </Box>

          {matchDownMD && NFTMetadata.length > 0 ? (
            <Box className={classes.metadataWrapper}>
              <DetailsToggle title={<Trans>Metadata</Trans>}>
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
      {transferModalOpen ? (
        <NFTTransfer
          canisterId={canisterId}
          nft={metadata}
          open={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          onTransferSuccess={handleTransferSuccess}
        />
      ) : null}
      {sellModalOpen ? (
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
