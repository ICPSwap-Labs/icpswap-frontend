import { Box, Grid, Typography, Theme } from "components/Mui";
import { useParams } from "react-router-dom";
import NFTList from "components/NFT/ext/NFTList";
import { MainCard, Breadcrumbs, Wrapper, LoadingRow } from "components/index";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useAccount } from "store/auth/hooks";
import type { EXTCollection } from "@icpswap/types";
import Avatar from "components/Image/Avatar";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
  infoCard: {
    display: "inline-block",
    background: theme.palette.background.level4,
    borderRadius: "12px",
    padding: "20px",
  },

  wrapper: {
    background: theme.palette.background.level2,
    padding: "30px",
    borderRadius: "12px",
    display: "grid",
    gridTemplateColumns: "85px auto fit-content(260px)",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr",
      padding: "10px",
    },
  },

  content: {
    paddingLeft: "30px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
      marginTop: "10px",
    },
  },

  name: {
    fontSize: "28px",
    fontWeight: "700",
    color: theme.palette.text.primary,
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
      fontWeight: "500",
    },
  },

  description: {
    maxWidth: "80%",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },

  button: {
    [theme.breakpoints.down("md")]: {
      marginTop: "10px",
    },
  },
}));

export interface NFTCanisterHeaderProps {
  collection: EXTCollection | undefined;
  count: string | number;
  loading?: boolean;
}

export function CanisterHeader({ collection, count, loading }: NFTCanisterHeaderProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      {loading || !collection ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : (
        <Box className={classes.wrapper}>
          <Avatar
            src={collection.avatar}
            sx={{
              width: "85px",
              height: "85px",
            }}
          />

          <Box className={classes.content}>
            <Typography className={classes.name}>{collection.name}</Typography>

            <Box mt="20px">
              <Grid sx={{ width: "100%" }} container alignItems="center">
                <Typography color="text.primary">{t("common.canister.id.colon")}</Typography>
                <Grid item xs ml="5px">
                  <Typography>{collection.id}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mt={1}>
              <Typography color="text.tertiary" className={classes.description}>
                {collection.description}
              </Typography>
            </Box>
          </Box>

          <Box className={classes.button}>
            <Box className={classes.infoCard}>
              <Typography color="text.primary" fontWeight={700} fontSize="18px" align="center">
                {Number(count)}
              </Typography>
              <Typography
                sx={{
                  marginTop: "4px",
                }}
              >
                {t("nft.nft.count")}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export function ExtNftCollectionDetail() {
  const { t } = useTranslation();
  const { id: canisterId } = useParams<{ id: string }>();
  const account = useAccount();

  const [reload, setReload] = useState(false);
  const { result: userExtAllNfts, loading } = useExtUserNFTs(account, reload);
  const { result: extAllCollections } = useEXTAllCollections();

  const collection = useMemo(() => {
    if (!extAllCollections) return undefined;
    return extAllCollections.find((e) => e.id === canisterId);
  }, [extAllCollections, canisterId]);

  const nfts = useMemo(() => {
    if (!userExtAllNfts) return undefined;
    return userExtAllNfts.filter((e) => e.canister === canisterId);
  }, [canisterId, userExtAllNfts]);

  const count = useMemo(() => {
    if (!nfts) return "--";
    return nfts.length;
  }, [nfts]);

  return (
    <Wrapper>
      <Box>
        <Breadcrumbs prevLink="/wallet" prevLabel={t("nft.wallet.nfts")} currentLabel={t("nfts")} />

        <Box mt={2}>
          <CanisterHeader loading={!collection} collection={collection} count={count ?? "--"} />
        </Box>

        <Box mt={2}>
          <MainCard level={2}>
            <Box mb={3}>
              <Typography
                fontWeight="700"
                fontSize="20px"
                color="text.primary"
                component="span"
                sx={{ marginRight: "20px", cursor: "pointer" }}
              >
                {t("nft.list")}
              </Typography>
            </Box>

            <NFTList nfts={nfts} loading={loading} collection={collection} setReload={() => setReload(!reload)} />
          </MainCard>
        </Box>
      </Box>
    </Wrapper>
  );
}
