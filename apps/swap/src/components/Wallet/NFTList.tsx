import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Box, Typography, Avatar, useTheme } from "components/Mui";
import { ImageLoading } from "@icpswap/ui";
import NFTListHeader from "components/Wallet/NFTListHeader";
import { useAccount } from "store/auth/hooks";
import { NoData } from "components/index";
import { isICPSwapOfficial } from "utils/index";
import { useSelectedCanistersManager, useEXTManager } from "store/nft/hooks";
import { useCanisterUserNFTCount, useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import type { NFTControllerInfo, EXTCollection, ExtNft } from "@icpswap/types";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";

const ICPSwapPositionNFTs = [
  "jwh2l-aqaaa-aaaan-qatdq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  "4lnl6-hqaaa-aaaag-qblla-cai",
];

export interface NFTCardUIProps {
  number: number | string | undefined;
  name: string | undefined;
  src: string | undefined;
  onClick?: () => void;
}

function NFTCardUI({ number, name, src, onClick }: NFTCardUIProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "12px",
        padding: "20px",
        "@media(max-width: 640px)": {
          padding: "15px",
        },
      }}
      onClick={onClick}
    >
      <Grid
        container
        alignItems="center"
        sx={{
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0 16px", overflow: "hidden" }}>
          <Avatar style={{ width: "60px", height: "60px" }} src={src ?? ""}>
            &nbsp;
          </Avatar>

          <Box sx={{ overflow: "hidden" }}>
            <Typography
              color="textPrimary"
              fontSize="16px"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                margin: "10px 0 0 0",
                display: "inline-flex",
                padding: "0px 12px",
                alignItems: "center",
                gap: "10px",
                borderRadius: "40px",
                background: "#4F5A84",
                color: "#ffffff",
                fontWeight: 500,
              }}
            >
              {number === undefined ? "--" : number}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export interface NFTCardProps {
  canister: NFTControllerInfo;
}

export function NFTCanisterCard({ canister }: NFTCardProps) {
  const account = useAccount();
  const history = useHistory();

  const { result: count } = useCanisterUserNFTCount(canister.cid, account);
  const { result: logo } = useCanisterLogo(canister.cid);

  const handleCardClick = () => {
    history.push(`/wallet/nft/canister/details/${canister.cid}`);
  };

  return <NFTCardUI onClick={handleCardClick} src={logo} name={canister.name} number={count?.toString()} />;
}

export interface ExtNFTCardProps {
  collection: EXTCollection;
  userAllExtNfts: ExtNft[] | undefined;
}

export function ExtNFTCard({ collection, userAllExtNfts }: ExtNFTCardProps) {
  const history = useHistory();

  const count = useMemo(() => {
    if (!userAllExtNfts || !collection) return undefined;
    return userAllExtNfts.filter((e) => e.canister === collection.id).length;
  }, [userAllExtNfts, collection]);

  const handleClick = () => {
    history.push(`/wallet/nft/canister/details/${collection.id}`);
  };

  return <NFTCardUI name={collection.name} src={collection.avatar} onClick={handleClick} number={count} />;
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

  const importedNFTs = useMemo(() => {
    if (!extAllCollections) return [];

    return nfts
      .map((nft) => extAllCollections.find((e) => e.id === nft.canisterId))
      .filter((e) => !!e) as EXTCollection[];
  }, [nfts, extAllCollections]);

  const { result: userAllExtNfts } = useExtUserNFTs(account);

  return (
    <Box>
      <NFTListHeader />

      <Box sx={{ overflow: "hidden", width: "100%", margin: "30px 0" }}>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            "@media(max-width: 1088px)": {
              gridTemplateColumns: "1fr 1fr",
            },
            "@media(max-width: 640px)": {
              gridTemplateColumns: "100%",
              gap: "20px 0",
            },
          }}
        >
          {!loading &&
            importedNFTs?.map((collection) => (
              <Grid key={collection.id} item xs={12}>
                <ExtNFTCard collection={collection} userAllExtNfts={userAllExtNfts} />
              </Grid>
            ))}

          {list?.map((canister) => (
            <Grid key={canister.cid} item xs={12}>
              <NFTCanisterCard canister={canister} />
            </Grid>
          ))}
        </Box>
      </Box>

      {loading ? <ImageLoading loading /> : null}

      {list && list.length === 0 && !!importedNFTs && importedNFTs.length === 0 && !loading ? <NoData /> : null}
    </Box>
  );
}
