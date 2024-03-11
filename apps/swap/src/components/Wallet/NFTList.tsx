import { useCallback, useMemo, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { gridSpacing } from "constants/theme";
import NFTListHeader from "components/Wallet/NFTListHeader";
import { useAccount } from "store/global/hooks";
import NoData from "components/no-data";
import { isICPSwapOfficial } from "utils/index";
import MainCard from "components/cards/MainCard";
import VerifyImage from "assets/images/nft/verify.svg";
import { useSelectedCanistersManager } from "store/nft/hooks";
import { useCanisterUserNFTCount, useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import { Theme } from "@mui/material/styles";
import type { NFTControllerInfo, EXTCollection, ExtNft } from "@icpswap/types";
import Loading from "components/Loading/Static";
import WalletContext from "components/Wallet/context";
import { useEXTManager } from "store/nft/hooks";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";

const ICPSwapPositionNFTs = [
  "jwh2l-aqaaa-aaaan-qatdq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  "4lnl6-hqaaa-aaaag-qblla-cai",
];

const useStyles = makeStyles((theme: Theme) => {
  return {
    introduction: {
      maxWidth: "800px",
      [theme.breakpoints.down("md")]: {
        ...theme.mixins.overflowEllipsis2,
      },
    },
  };
});

export interface NFTCardProps {
  canister: NFTControllerInfo;
}

export function NFTCanisterCard({ canister }: NFTCardProps) {
  const account = useAccount();
  const classes = useStyles();
  const history = useHistory();

  const { refreshCounter } = useContext(WalletContext);
  const { result: count } = useCanisterUserNFTCount(canister.cid, account, refreshCounter);
  const { result: logo } = useCanisterLogo(canister.cid);

  const handleCardClick = () => {
    history.push(`/wallet/nft/canister/details/${canister.cid}`);
  };

  return (
    <MainCard level={1} onClick={handleCardClick}>
      <Grid
        container
        alignItems="center"
        sx={{
          cursor: "pointer",
        }}
      >
        <Grid item xs container mr="20px">
          <Grid item mr={2}>
            <Grid
              container
              alignItems="center"
              sx={{
                height: "100%",
              }}
            >
              <Avatar src={logo ?? ""}>&nbsp;</Avatar>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid item xs container alignItems="center">
              <Typography color="textPrimary" variant="h4" component="span" mr={1}>
                {canister.name}
              </Typography>
              {isICPSwapOfficial(canister.owner) && <img width="24px" height="24px" src={VerifyImage} alt="" />}
            </Grid>
            <Typography fontSize={12} mt={2} className={classes.introduction}>
              {canister.introduction}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h2" color="textPrimary" align="right">
            {String(count ?? 0)}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export interface ExtNFTCardProps {
  collection: EXTCollection;
  userAllExtNfts: ExtNft[] | undefined;
}

export function ExtNFTCard({ collection, userAllExtNfts }: ExtNFTCardProps) {
  const classes = useStyles();
  const history = useHistory();

  const count = useMemo(() => {
    if (!userAllExtNfts || !collection) return "--";
    return userAllExtNfts.filter((e) => e.canister === collection.id).length;
  }, [userAllExtNfts, collection]);

  const handleClick = () => {
    history.push(`/wallet/nft/canister/details/${collection.id}`);
  };

  return (
    <MainCard level={1} onClick={handleClick}>
      <Grid
        container
        alignItems="center"
        sx={{
          cursor: "pointer",
        }}
      >
        <Grid item xs container mr="20px">
          <Grid item mr={2}>
            <Grid
              container
              alignItems="center"
              sx={{
                height: "100%",
              }}
            >
              <Avatar src={collection.avatar ?? ""}>&nbsp;</Avatar>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid item xs container alignItems="center">
              <Typography color="textPrimary" variant="h4" component="span" mr={1}>
                {collection.name}
              </Typography>
            </Grid>
            <Typography fontSize={12} mt={2} className={classes.introduction}>
              {collection.description}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h2" color="textPrimary" align="right">
            {count}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default function NFTList() {
  const { result, loading } = useNFTCanisterList(0, 1000);
  const nftCanisters = result?.content;
  const [userSelectedCanisters] = useSelectedCanistersManager();

  const account = useAccount();

  const list = useMemo(() => {
    return nftCanisters?.filter((canister) => {
      return (
        (userSelectedCanisters.includes(canister.cid) || isICPSwapOfficial(canister.owner)) &&
        !ICPSwapPositionNFTs.includes(canister.cid) // Filter ICPSwap Position NFTs
      );
    });
  }, [userSelectedCanisters, nftCanisters]);

  const { nfts } = useEXTManager();
  const { result: extAllCollections } = useEXTAllCollections();

  console.log("extAllCollections:", extAllCollections);

  const importedNFTs = useMemo(() => {
    if (!extAllCollections) return [];

    return nfts
      .map((nft) => extAllCollections.find((e) => e.id === nft.canisterId))
      .filter((e) => !!e) as EXTCollection[];
  }, [nfts, extAllCollections]);

  const { result: userAllExtNfts } = useExtUserNFTs(account);

  console.log("userAllExtNfts:", userAllExtNfts);

  return (
    <Grid container flexDirection="column" spacing={gridSpacing}>
      <Grid item container>
        <Grid item xs={12} container justifyContent="flex-end">
          <NFTListHeader />
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing="12px">
        {importedNFTs?.map((collection) => (
          <Grid key={collection.id} item xs={12}>
            <ExtNFTCard collection={collection} userAllExtNfts={userAllExtNfts} />
          </Grid>
        ))}

        {list?.map((canister) => (
          <Grid key={canister.cid} item xs={12}>
            <NFTCanisterCard canister={canister} />
          </Grid>
        ))}

        {loading ? <Loading loading /> : null}
        {list && list.length === 0 && !loading ? <NoData /> : null}
      </Grid>
    </Grid>
  );
}
