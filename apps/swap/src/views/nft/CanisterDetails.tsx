import { useMemo, useState } from "react";
import { Typography, Box } from "components/Mui";
import { useParams } from "react-router-dom";
import NFTList from "components/NFT/NFTList";
import CollectionUserTransactions from "components/NFT/CollectionUserTransactions";
import CanisterHeader from "components/NFT/CanisterHeader";
import { useCanisterMetadata, useCanisterCycles, useCanisterUserNFTCount } from "hooks/nft/useNFTCalls";
import { MainCard, Breadcrumbs, Wrapper } from "components/index";
import { t, Trans } from "@lingui/macro";
import { useAccount } from "store/global/hooks";
import type { NFTControllerInfo } from "@icpswap/types";
import { useEXTManager } from "store/nft/hooks";

import { ExtNftCollectionDetail } from "./ExtCanisterDetails";

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
        <Breadcrumbs prevLabel={<Trans>Wallet NFTs</Trans>} prevLink="/wallet" currentLabel={<Trans>NFTs</Trans>} />

        <Box mt={2}>
          <CanisterHeader
            loading={loading}
            details={metadata ?? ({} as NFTControllerInfo)}
            cycles={cycles ?? BigInt(0)}
            count={count ?? BigInt(0)}
          />
        </Box>

        <Box mt={2}>
          <MainCard level={3}>
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
