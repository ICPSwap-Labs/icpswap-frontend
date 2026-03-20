import { MainCard } from "@icpswap/ui";
import { Breadcrumbs, InfoWrapper, LoadingRow } from "components/index";
import { NFTLayoutHeader, NFTs } from "components/info/nft";
import { Box, Typography } from "components/Mui";
import { useNFTCanisterCycles, useNFTCanisterMetadata, useNFTUserCanisterCount } from "hooks/info/nft";
import i18n from "i18n/index";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

type PageType = {
  component: React.FC<{ canisterId: string }>;
  key: string;
  label: React.ReactNode;
};

const Pages: PageType[] = [{ key: "NFTs", label: i18n.t("nfts"), component: NFTs }];

export default function NFTCanisterDetails() {
  const { id: canisterId } = useParams() as { id: string };

  const { data: metadata, isLoading: loading } = useNFTCanisterMetadata(canisterId);
  const { data: cycles } = useNFTCanisterCycles(canisterId);
  const { data: count } = useNFTUserCanisterCount(canisterId, "");

  const [pageKey, setPageKey] = useState(Pages[0].key);

  const getComponent = () => {
    const Component = Pages.find((page) => page.key === pageKey)?.component ?? Pages[0].component;
    return <Component canisterId={canisterId} />;
  };

  return (
    <InfoWrapper>
      <Box>
        <Breadcrumbs
          prevLink="/info-nfts/canisters"
          prevLabel={i18n.t("nft.canisters")}
          currentLabel={i18n.t("nfts")}
        />

        <Box mt={2}>
          {loading ? (
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
            <NFTLayoutHeader details={metadata} cycles={cycles ?? BigInt(0)} count={count ?? BigInt(0)} />
          )}
        </Box>

        <Box mt={2}>
          <MainCard level={3}>
            <Box mb={3}>
              {Pages.map((page) => (
                <Typography
                  fontWeight="700"
                  fontSize="20px"
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
    </InfoWrapper>
  );
}
