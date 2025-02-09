import { ReactNode, useMemo } from "react";
import { Typography, Grid, Box, useMediaQuery, Avatar, makeStyles, Theme } from "components/Mui";
import { createTheme } from "@mui/material/styles";
import { useCanisterMetadata } from "hooks/nft/useNFTCalls";
import { useNFTMintSupply } from "hooks/nft/useNFTMintSupply";
import { useCollectionData } from "hooks/nft/tradeData";
import VerifyNFT from "components/NFT/VerifyNFT";
import WICPPriceFormat from "components/NFT/WICPPriceFormat";
import { formatAmount } from "@icpswap/utils";
import { LoadingRow, Breadcrumbs } from "components/index";
import { useTranslation } from "react-i18next";

import CollectionLinks from "../collectionsIcon/index";

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      md: 1280,
      960: 960,
      780: 780,
      640: 640,
    },
  },
});

const useStyles = makeStyles((theme: Theme) => {
  return {
    descItem: {
      fontSize: "12px",
      lineHeight: "20px",
    },

    infoBox: {
      display: "flex",
      background: theme.palette.background.level1,
      borderRadius: "12px",
      gap: "70px",
      padding: "27px 64px 18px 64px",
      [customizeTheme.breakpoints.down("960")]: {
        gap: "60px",
        padding: "27px 54px 18px 54px",
      },
      [customizeTheme.breakpoints.down("780")]: {
        gap: "40px",
        padding: "20px 34px 13px 34px",
      },
      [customizeTheme.breakpoints.down("780")]: {
        gap: "40px",
        padding: "13px 20px 13px 20px",
      },
    },

    infoText: {
      fontWeight: "600",
      fontSize: "28px",
      color: theme.palette.text.primary,
      textAlign: "center",
      [customizeTheme.breakpoints.down("md")]: {
        fontSize: "24px",
      },
      [customizeTheme.breakpoints.down("md")]: {
        fontSize: "20px",
      },
    },
  };
});

function CollectionDataItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  const classes = useStyles();

  return (
    <Box>
      <Typography className={classes.infoText} component="div">
        {value}
      </Typography>
      <Typography sx={{ marginTop: "8px" }} align="center">
        {label}
      </Typography>
    </Box>
  );
}

export default function CollectionInfo({ canisterId }: { canisterId: string }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { result: canister, loading } = useCanisterMetadata(canisterId);
  const { result: collectionResult } = useCollectionData(canisterId);

  const mintSupply = useNFTMintSupply(canister);

  const matchDownMD = useMediaQuery(customizeTheme.breakpoints.down("md"));
  const matchDown640 = useMediaQuery(customizeTheme.breakpoints.down("640"));

  const links = useMemo(() => {
    if (canisterId === "xzcnc-myaaa-aaaak-abk7a-cai") {
      const _links = [...(canister?.linkMap ?? [])].filter((e) => e.k !== "Twitter");
      _links.push({ k: "Twitter", v: "https://twitter.com/ghost_icp" });
      return _links;
    }

    return canister?.linkMap;
  }, [canisterId, canister?.linkMap]);

  return (
    <>
      <Box mb="40px">
        <Breadcrumbs
          prevLink="/marketplace/collections"
          prevLabel={t("nft.marketplace")}
          currentLabel={canister?.name}
        />
      </Box>

      <Grid container flexDirection={matchDownMD ? "column" : "row"}>
        <Box sx={{ minWidth: "390px" }}>
          {loading ? (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          ) : (
            <Grid container>
              <Avatar src={canister?.image ?? ""} sx={{ width: "100px", height: "100px", marginRight: "24px" }}>
                &nbsp;
              </Avatar>
              <Grid item>
                <Typography
                  color="text.primary"
                  sx={{
                    fontSize: "22px",
                    fontWeight: "600",
                    marginTop: "10px",
                  }}
                >
                  {canister?.name}
                </Typography>
                <Box mt="20px">
                  <VerifyNFT minter={canister?.creator} secondaryColor fontSize="14px" />
                </Box>

                <Box mt="20px">
                  <CollectionLinks links={links} width="42px" />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        <Grid item xs mt={matchDownMD ? "20px" : "0"}>
          <Grid container justifyContent={matchDownMD ? "flex-start" : "flex-end"}>
            <Box className={classes.infoBox}>
              {matchDown640 ? (
                <>
                  <Box>
                    <CollectionDataItem
                      value={
                        collectionResult?.floorPrice ? (
                          <WICPPriceFormat
                            imgSize="22px"
                            price={collectionResult?.floorPrice}
                            fontSize="28px"
                            fontWeight={600}
                            digits={4}
                            typographyProps={{
                              className: classes.infoText,
                            }}
                          />
                        ) : (
                          "--"
                        )
                      }
                      label={t("nft.floor.price")}
                    />

                    <Box sx={{ height: "20px", width: "1px" }} />

                    <CollectionDataItem
                      value={
                        collectionResult?.totalTurnover || collectionResult?.totalTurnover === BigInt(0) ? (
                          <WICPPriceFormat
                            imgSize="22px"
                            price={collectionResult?.totalTurnover}
                            fontSize="28px"
                            fontWeight={600}
                            color="text.primary"
                            typographyProps={{
                              className: classes.infoText,
                            }}
                          />
                        ) : (
                          "--"
                        )
                      }
                      label={t("nft.total.volume")}
                    />
                  </Box>

                  <Box>
                    <CollectionDataItem
                      value={
                        !!mintSupply || mintSupply === BigInt(0)
                          ? formatAmount(Number(mintSupply), { digits: 0 })
                          : "--"
                      }
                      label={t("nft.items")}
                    />

                    <Box sx={{ height: "20px", width: "1px" }} />

                    <CollectionDataItem
                      value={
                        !!collectionResult?.listSize || collectionResult?.listSize === BigInt(0)
                          ? formatAmount(Number(collectionResult?.listSize), { digits: 0 })
                          : "--"
                      }
                      label={t("nft.listings")}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <CollectionDataItem
                    value={
                      collectionResult?.floorPrice || collectionResult?.floorPrice === BigInt(0) ? (
                        <WICPPriceFormat
                          imgSize="22px"
                          price={collectionResult?.floorPrice}
                          fontSize="28px"
                          fontWeight={600}
                          digits={4}
                          typographyProps={{
                            className: classes.infoText,
                          }}
                        />
                      ) : (
                        "--"
                      )
                    }
                    label={t("nft.floor.price")}
                  />

                  <CollectionDataItem
                    value={
                      collectionResult?.totalTurnover || collectionResult?.totalTurnover === BigInt(0) ? (
                        <WICPPriceFormat
                          imgSize="22px"
                          price={collectionResult?.totalTurnover}
                          fontSize="28px"
                          fontWeight={600}
                          color="text.primary"
                          typographyProps={{
                            className: classes.infoText,
                          }}
                        />
                      ) : (
                        "--"
                      )
                    }
                    label={t("nft.total.volume")}
                  />

                  <CollectionDataItem
                    value={
                      !!mintSupply || mintSupply === BigInt(0) ? formatAmount(Number(mintSupply), { digits: 0 }) : "--"
                    }
                    label={t("nft.items")}
                  />

                  <CollectionDataItem
                    value={
                      !!collectionResult?.listSize || collectionResult?.listSize === BigInt(0)
                        ? formatAmount(Number(collectionResult?.listSize), { digits: 0 })
                        : "--"
                    }
                    label={t("nft.listings")}
                  />
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
