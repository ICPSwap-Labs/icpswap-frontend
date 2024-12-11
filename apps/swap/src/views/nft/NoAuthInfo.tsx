import { ReactElement } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Typography, Grid, Box, Link, useMediaQuery, Button, useTheme, makeStyles, Theme } from "components/Mui";
import Copy from "components/Copy";
import NFTVerifyLabel from "components/NFT/VerifyLabel";
import LazyImage from "components/LazyImage";
import { BigNumber, mockALinkAndOpen, openBase64ImageInNewWindow, shorten, timestampFormat } from "@icpswap/utils";
import { isICPSwapOfficial, encodeTokenIdentifier, arrayBufferToString } from "utils/index";
import { Trans, t } from "@lingui/macro";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import FileImage from "components/NFT/FileImage";
import { TextButton, InfoWrapper } from "components/index";
import DetailsToggle from "components/NFT/DetailsToggle";
import { type NFTTokenMetadata } from "@icpswap/types";
import { useCanisterMetadata } from "hooks/nft/useNFTCalls";
import CollectionIcons from "components/NFT/collectionsIcon";
import NFTCanisterLink from "components/info/NFTCanisterLink";
import Logo from "components/Logo";

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

export default function NoAuthNFTInfo() {
  const theme = useTheme() as Theme;
  const classes = useStyles();
  const history = useHistory();
  const { canisterId, tokenId } = useParams<{ canisterId: string; tokenId: string }>();
  const { result: canisterMetadata } = useCanisterMetadata(canisterId);
  const metadata = useNFTMetadata(canisterId, BigInt(tokenId));

  const NFTMetadata = metadataFormat(metadata);

  const handleImageClick = () => {
    if (!metadata.filePath) return;

    if (metadata.filePath.includes("base64")) {
      openBase64ImageInNewWindow(metadata.filePath);
      return;
    }

    mockALinkAndOpen(metadata.filePath, "file_path");
  };

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogIn = () => {
    history.push("/");
  };

  return (
    <Box
      sx={{
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(50% 50% at 50% 45%,rgba(255, 143, 224, 0.2) 0,rgba(255,255,255,0) 100%)"
            : theme.palette.background,

        minHeight: "100vh",
        [theme.breakpoints.down("md")]: {
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(50% 50% at 50% 45%,rgba(255, 143, 224, 0.2) 0,rgba(255,255,255,0) 100%)"
              : theme.palette.primary.light,
        },
      }}
    >
      <Box sx={{ minHeight: "100vh" }}>
        <Grid container alignItems="center" sx={{ height: "70px", padding: "0 20px" }}>
          <Grid item xs>
            <Logo />
          </Grid>

          <Button variant="contained" size="medium" onClick={handleLogIn}>
            <Trans>Log in to ICPSwap</Trans>
          </Button>
        </Grid>

        <Box
          sx={{
            minHeight: {
              xs: "calc(100vh - 90px)",
              md: "calc(100vh - 90px)",
            },
            position: "relative",
          }}
        >
          <Box mt="20px">
            <InfoWrapper>
              <Box className={classes.wrapper}>
                <Box className={classes.leftWrapper}>
                  <Box className={classes.logoWrapper}>
                    <Grid
                      item
                      sx={{ position: "relative", background: theme.palette.background.level2, borderRadius: "8px" }}
                      container
                      justifyContent="center"
                    >
                      <LazyImage
                        src={metadata.filePath}
                        showDefault={metadata?.fileType !== "image"}
                        CustomImage={
                          metadata?.fileType !== "image" && !!metadata?.fileType ? (
                            <FileImage fileType={metadata?.fileType ?? ""} />
                          ) : null
                        }
                        onClick={handleImageClick}
                        boxSX={{
                          cursor: "pointer",
                        }}
                      />
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
                        }}
                        component="span"
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
                        <DetailsItem label={t`NFT Description`} value={`${metadata?.introduction ?? "--"}`} />
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
                            <Copy content={canisterMetadata?.owner ?? ""}>
                              {shorten(canisterMetadata?.owner ?? "", 12)}
                            </Copy>
                          }
                        />
                        <DetailsItem
                          label={t`Creator Royalty`}
                          value={`${new BigNumber(String(canisterMetadata?.royalties ?? 0))
                            .dividedBy(100)
                            .toFormat()}%`}
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
            </InfoWrapper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
