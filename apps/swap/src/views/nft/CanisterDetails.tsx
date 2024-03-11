import { useMemo, useState } from "react";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, useParams } from "react-router-dom";
import NFTList from "components/NFT/NFTList";
import CollectionUserTransactions from "components/NFT/CollectionUserTransactions";
import CanisterHeader from "components/NFT/CanisterHeader";
import { useCanisterMetadata, useCanisterCycles, useCanisterUserNFTCount } from "hooks/nft/useNFTCalls";
import MainCard from "components/cards/MainCard";
import { t, Trans } from "@lingui/macro";
import { useAccount } from "store/global/hooks";
import type { NFTControllerInfo } from "@icpswap/types";
import Wrapper from "components/Wrapper";
import { useEXTManager } from "store/nft/hooks";
import { ExtNftCollectionDetail } from "./ExtCanisterDetails";

const useStyles = makeStyles(() => {
  return {
    breadcrumbs: {
      "& a": {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  };
});

type PageType = {
  component: React.FC<{ canisterId: string }>;
  key: string;
  label: React.ReactNode;
};

const Pages: PageType[] = [
  { key: "NFTs", label: t`NFTs`, component: NFTList },
  { key: "Transactions", label: t`Transactions`, component: CollectionUserTransactions },
];

function ICPSwapNFT() {
  const { id: canisterId } = useParams<{ id: string }>();
  const account = useAccount();
  const classes = useStyles();
  const { result: metadata, loading } = useCanisterMetadata(canisterId);
  const { result: cycles } = useCanisterCycles(canisterId);
  const { result: count } = useCanisterUserNFTCount(canisterId, account);

  const [pageKey, setPageKey] = useState(Pages[0].key);

  const getComponent = () => {
    const Component = Pages.find((page) => page.key === pageKey)?.component ?? Pages[0].component;
    return <Component canisterId={canisterId} />;
  };

  return (
    <Wrapper>
      <Box>
        <Breadcrumbs className={classes.breadcrumbs}>
          <Link to="/wallet">
            <Typography color="secondary">
              <Trans>Wallet NFTs</Trans>
            </Typography>
          </Link>
          <Typography>
            <Trans>NFTs</Trans>
          </Typography>
        </Breadcrumbs>

        <Box mt={2}>
          <CanisterHeader
            loading={loading}
            details={metadata ?? ({} as NFTControllerInfo)}
            cycles={cycles ?? BigInt(0)}
            count={count ?? BigInt(0)}
          />
        </Box>

        <Box mt={2}>
          <MainCard level={2}>
            <Box mb={3}>
              {Pages.map((page) => (
                <Typography
                  fontWeight="700"
                  fontSize="20px"
                  color={pageKey === page.key ? "text.primary" : "text.secondary"}
                  key={page.key}
                  component="span"
                  sx={{ marginRight: "20px", cursor: "pointer" }}
                  onClick={() => setPageKey(page.key)}
                >
                  {page.label}
                </Typography>
              ))}
            </Box>

            {getComponent()}
          </MainCard>
        </Box>
      </Box>
    </Wrapper>
  );
}

export default function NFTCanisterDetails() {
  const { id: canisterId } = useParams<{ id: string }>();
  const { nfts } = useEXTManager();

  const isExt = useMemo(() => {
    return !!nfts.find((e) => e.canisterId === canisterId);
  }, [nfts, canisterId]);

  return isExt ? <ExtNftCollectionDetail /> : <ICPSwapNFT />;
}
