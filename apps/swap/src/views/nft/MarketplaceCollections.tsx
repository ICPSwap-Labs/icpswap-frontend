import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MainCard from "components/cards/MainCard";
import { useNFTCanisterList, useCanisterMetadata } from "hooks/nft/useNFTCalls";
import { Theme } from "@mui/material/styles";
import Wrapper from "components/Wrapper";
import Breadcrumbs from "components/Breadcrumbs";
import { Trans } from "@lingui/macro";
import type { NFTControllerInfo } from "@icpswap/types";
import Loading from "components/Loading/Static";
import CollectionAvatar from "components/NFT/CollectionAvatar";

const useStyles = makeStyles((theme: Theme) => {
  return {
    collectionsWrapper: {
      position: "relative",
      display: "grid",
      gridGap: "20px 20px",
      gridTemplateColumns: "1fr 1fr 1fr",
      width: "fit-content",
      "@media (max-width:479px)": {
        position: "static",
        right: "0",
        gridGap: "20px 20px",
        gridTemplateColumns: "1fr",
        width: "auto",
      },
      "@media (min-width:480px) and (max-width:719px)": {
        position: "static",
        right: "0",
        gridGap: "20px 20px",
        gridTemplateColumns: "1fr 1fr",
        width: "auto",
      },
      "@media (min-width:720px) and (max-width:1060px)": {
        position: "static",
        right: "0",
        gridGap: "20px 20px",
        gridTemplateColumns: "1fr 1fr 1fr",
        width: "auto",
      },
      "@media (min-width:1060px) ": {
        position: "static",
        right: "0",
        gridGap: "20px 20px",
        gridTemplateColumns: "repeat(4, 1fr)",
        width: "auto",
      },
    },

    collectionWrapper: {
      background: theme.palette.background.level4,
      padding: "8px 8px 20px 8px",
      border: "1px solid #2F3C6D",
      borderRadius: "12px",
      cursor: "pointer",
    },

    avatar: {
      width: "100px",
      height: "100px",
    },
  };
});

export function CollectionCard({ collection }: { collection: NFTControllerInfo }) {
  const classes = useStyles();
  const history = useHistory();

  const { result: metadata } = useCanisterMetadata(collection.cid);

  const handleCollectionClick = () => {
    history.push(`/marketplace/NFT/${collection.cid}`);
  };

  return (
    <Box className={classes.collectionWrapper} onClick={handleCollectionClick}>
      <Box
        sx={{
          height: "194px",
          borderRadius: "12px",
        }}
      >
        <CollectionAvatar metadata={metadata} />
      </Box>

      <Box mt="20px">
        <Typography
          color="text.primary"
          fontSize="18px"
          fontWeight="600"
          align="center"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {collection.name}
        </Typography>
      </Box>
    </Box>
  );
}

const filteredNFTs = [
  "rppv3-yqaaa-aaaan-qcx4q-cai",
  "46dg2-ciaaa-aaaan-qa3dq-cai",
  "v4jsw-5aaaa-aaaan-qaoha-cai",
  "ey3ct-4aaaa-aaaak-aaueq-cai",
  "e7xmv-vyaaa-aaaag-qahha-cai",
  "ewuhj-dqaaa-aaaag-qahgq-cai",
];

export default function MarketplaceCollections() {
  const classes = useStyles();
  const { result, loading } = useNFTCanisterList(0, 1000);

  const collections = useMemo(() => {
    return result?.content.filter((e) => !filteredNFTs.includes(e.cid)) ?? [];
  }, [result]);

  return (
    <Wrapper>
      {/* <Breadcrumbs
        prevLink="/marketplace/NFT"
        prevLabel={<Trans>Marketplace</Trans>}
        currentLabel={<Trans>Collections</Trans>}
      /> */}

      <Box sx={{ margin: "60px 0 40px 0" }}>
        <Typography color="text.primary" fontWeight="700" fontSize="30px">
          <Trans>Collections</Trans>
        </Typography>
      </Box>

      <MainCard>
        <Box className={classes.collectionsWrapper}>
          {collections.map((collection, index) => (
            <Box
              key={`${collection.cid}-${index}`}
              sx={{
                overflow: "hidden",
              }}
            >
              <CollectionCard collection={collection} />
            </Box>
          ))}
        </Box>

        {loading ? <Loading loading={loading} /> : null}
      </MainCard>
    </Wrapper>
  );
}
